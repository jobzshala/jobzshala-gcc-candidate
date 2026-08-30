"use client";

/**
 * Voice Resume Builder — wired to the real v3 backend.
 *
 * Flow: language select → mic permission → 6 spoken questions (real
 * MediaRecorder capture) → per-answer upload (the backend transcribes with
 * Whisper and extracts structured data synchronously in the same request)
 * → transcript review/edit (edits re-run extraction) → extraction preview →
 * commit (writes the profile + generates the PDF resume via
 * resume-builder.service.ts).
 *
 * Sessions persist server-side for 2 hours — createOrResumeSession returns
 * an existing IN_PROGRESS session with its answers, and this page fast-
 * forwards past already-answered questions so a dropped connection or page
 * reload never loses spoken answers.
 */

import "./voice-resume.css";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ROUTES } from "@/lib/routes";
import { ApiError } from "@/lib/api/client";
import {
  createOrResumeSession,
  getQuestions,
  uploadAnswer,
  updateAnswerTranscript,
  commitSession,
  type VoiceResumeSession,
  type VoiceResumeQuestion,
  type VoiceResumeAnswer,
  type VoiceResumeQuestionKey,
  type VoiceResumeLanguageCode,
} from "@/lib/api/voiceResume";
import { VOICE_RESUME_LANGUAGES } from "@/lib/voiceResume/questions";

type FlowStep =
  | "entry"
  | "lang"
  | "perm"
  | "denied"
  | "question"
  | "recorded"
  | "uploading"
  | "transcribing"
  | "review"
  | "extract"
  | "committing"
  | "done";

function fmtSec(s: number): string {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function ProgressRow({ total, qIndex }: { total: number; qIndex: number }) {
  return (
    <div className="vr-progress">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={`vr-seg ${i < qIndex ? "vr-done" : i === qIndex ? "vr-now" : ""}`} />
      ))}
    </div>
  );
}

// Picks the first audio container this browser's MediaRecorder can produce
// that the backend's AUDIO_MIME_TYPES allowlist accepts (webm on
// Chrome/Android, mp4 on iOS Safari).
function pickRecorderMime(): { mime: string; ext: string } {
  if (typeof MediaRecorder !== "undefined") {
    if (MediaRecorder.isTypeSupported("audio/webm")) return { mime: "audio/webm", ext: "webm" };
    if (MediaRecorder.isTypeSupported("audio/mp4")) return { mime: "audio/mp4", ext: "mp4" };
  }
  return { mime: "", ext: "webm" };
}

export default function VoiceResumePage() {
  const { t } = useTranslation();
  const [step, setStep] = useState<FlowStep>("entry");
  const [lang, setLang] = useState<VoiceResumeLanguageCode>("hi");
  const [session, setSession] = useState<VoiceResumeSession | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [recordedDur, setRecordedDur] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<VoiceResumeQuestionKey, VoiceResumeAnswer>>>({});
  const [transcript, setTranscript] = useState("");
  const [flowError, setFlowError] = useState("");
  const [busy, setBusy] = useState(false);
  const [previewingLang, setPreviewingLang] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const secondsRef = useRef(0);
  const questionAudioRef = useRef<HTMLAudioElement | null>(null);

  const questions: VoiceResumeQuestion[] = session?.questions ?? [];
  const question = questions[qIndex] ?? null;
  const currentLang = VOICE_RESUME_LANGUAGES.find((l) => l.code === lang) ?? VOICE_RESUME_LANGUAGES[0];
  const isLast = questions.length > 0 && qIndex === questions.length - 1;
  const currentAnswer = question ? answers[question.key] : undefined;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Frees the previous recording's object URL whenever a new one replaces it.
  useEffect(() => {
    return () => {
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    };
  }, [recordedUrl]);

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  // Silences whatever is reading the question out loud — called before the
  // mic starts (so the recording doesn't capture the system's own voice)
  // and whenever the question changes.
  const stopQuestionAudio = () => {
    questionAudioRef.current?.pause();
    questionAudioRef.current = null;
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  // Reads the current question aloud: the pre-generated AI clip (exactly
  // matches the displayed text, same voice on every device) with browser
  // SpeechSynthesis as fallback, silent if neither is available.
  const speakQuestion = (q: VoiceResumeQuestion) => {
    stopQuestionAudio();
    const audio = new Audio(`/audio/voice-resume/questions/${lang}/${q.key}.mp3`);
    questionAudioRef.current = audio;
    const fallback = () => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      const meta = VOICE_RESUME_LANGUAGES.find((l) => l.code === lang);
      const utterance = new SpeechSynthesisUtterance(q.text);
      if (meta) utterance.lang = meta.speechLang;
      window.speechSynthesis.speak(utterance);
    };
    audio.addEventListener("error", fallback);
    audio.play().catch(fallback);
  };

  // Auto-reads each question as it appears.
  useEffect(() => {
    if (step === "question" && question) {
      speakQuestion(question);
    }
    return stopQuestionAudio;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, qIndex]);

  const goToQuestion = (index: number) => {
    stopTimer();
    setRecording(false);
    setSeconds(0);
    secondsRef.current = 0;
    setRecordedBlob(null);
    setRecordedUrl(null);
    setFlowError("");
    setQIndex(index);
    setStep("question");
  };

  // -------------------------------------------------------------------
  // Session
  // -------------------------------------------------------------------

  const startSession = async () => {
    setBusy(true);
    setFlowError("");
    try {
      const created = await createOrResumeSession(lang);
      // A resumed session keeps its ORIGINAL ui_language and returns
      // questions in it — if the candidate just picked a different
      // language, honor their choice by re-fetching the question texts in
      // it (the language-independent /questions endpoint). spoken_language
      // and the question audio clips both follow `lang`, so everything the
      // candidate sees and hears stays in the language they selected.
      if (created.ui_language !== lang) {
        created.questions = await getQuestions(lang);
      }
      setSession(created);

      // Restore prior progress: keep the newest DONE answer per question.
      const restored: Partial<Record<VoiceResumeQuestionKey, VoiceResumeAnswer>> = {};
      for (const a of created.answers) {
        if (a.transcription_status === "DONE" && a.extraction_status === "DONE" && !restored[a.question_key]) {
          restored[a.question_key] = {
            answer_id: a.id,
            question_key: a.question_key,
            transcription_status: a.transcription_status,
            extraction_status: a.extraction_status,
            transcript_raw: a.transcript_raw,
            transcript_edited: a.transcript_edited,
            extracted_json: a.extracted_json,
          };
        }
      }
      setAnswers(restored);
      setStep("perm");
    } catch (err) {
      setFlowError(err instanceof ApiError ? err.message : t("voiceResume.errors.generic"));
    } finally {
      setBusy(false);
    }
  };

  const requestMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      // Fast-forward past questions already answered in a resumed session.
      const firstUnanswered = (session?.questions ?? []).findIndex((q) => !answers[q.key]);
      goToQuestion(firstUnanswered === -1 ? (session?.questions.length ?? 1) - 1 : firstUnanswered);
      if (firstUnanswered === -1) setStep("extract");
    } catch {
      setStep("denied");
    }
  };

  // -------------------------------------------------------------------
  // Recording
  // -------------------------------------------------------------------

  const toggleRecording = () => {
    if (!question) return;
    if (!recording) {
      // Never let the mic record the system's own question narration.
      stopQuestionAudio();
      const stream = streamRef.current;
      if (!stream) {
        setStep("perm");
        return;
      }
      const { mime } = pickRecorderMime();
      const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        setRecordedBlob(blob);
        setRecordedUrl(URL.createObjectURL(blob));
        setRecordedDur(secondsRef.current);
        setStep("recorded");
      };
      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      setSeconds(0);
      secondsRef.current = 0;
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          const next = s + 1;
          secondsRef.current = next;
          if (next >= question.max_duration_sec) {
            stopTimer();
            setRecording(false);
            recorderRef.current?.stop();
          }
          return next;
        });
      }, 1000);
    } else {
      stopTimer();
      setRecording(false);
      recorderRef.current?.stop();
    }
  };

  // -------------------------------------------------------------------
  // Upload → transcription → extraction (single synchronous backend call)
  // -------------------------------------------------------------------

  const startProcessing = async () => {
    if (!session || !question || !recordedBlob) return;
    setFlowError("");
    setStep("uploading");
    // The backend transcribes + extracts inside this one request — flip the
    // status copy from "uploading" to "listening" partway through the wait.
    const phaseTimer = setTimeout(() => {
      setStep((cur) => (cur === "uploading" ? "transcribing" : cur));
    }, 1500);

    try {
      const { ext } = pickRecorderMime();
      const answer = await uploadAnswer({
        sessionId: session.session_id,
        questionKey: question.key,
        spokenLanguage: lang,
        audio: recordedBlob,
        filename: `answer.${ext}`,
      });
      setAnswers((prev) => ({ ...prev, [question.key]: answer }));
      setTranscript(answer.transcript_edited ?? answer.transcript_raw ?? "");
      setStep("review");
    } catch (err) {
      setFlowError(err instanceof ApiError ? err.message : t("voiceResume.errors.generic"));
      setStep("recorded");
    } finally {
      clearTimeout(phaseTimer);
    }
  };

  // -------------------------------------------------------------------
  // Transcript review → extraction preview
  // -------------------------------------------------------------------

  const handleConfirmTranscript = async () => {
    if (!question || !currentAnswer) return;
    const original = currentAnswer.transcript_edited ?? currentAnswer.transcript_raw ?? "";
    const edited = transcript.trim();

    if (!edited || edited === original.trim()) {
      setStep("extract");
      return;
    }

    // Edited transcript → the backend re-runs extraction on the new text.
    setBusy(true);
    setFlowError("");
    try {
      const updated = await updateAnswerTranscript(currentAnswer.answer_id, edited);
      setAnswers((prev) => ({ ...prev, [question.key]: updated }));
      setStep("extract");
    } catch (err) {
      setFlowError(err instanceof ApiError ? err.message : t("voiceResume.errors.generic"));
    } finally {
      setBusy(false);
    }
  };

  const openReview = () => {
    if (!currentAnswer) return;
    setTranscript(currentAnswer.transcript_edited ?? currentAnswer.transcript_raw ?? "");
    setStep("review");
  };

  const handleNext = async () => {
    if (!session) return;
    if (!isLast) {
      goToQuestion(qIndex + 1);
      return;
    }
    setFlowError("");
    setStep("committing");
    try {
      await commitSession(session.session_id);
      setStep("done");
    } catch (err) {
      setFlowError(err instanceof ApiError ? err.message : t("voiceResume.errors.generic"));
      setStep("extract");
    }
  };

  const previewLanguage = (code: string) => {
    setPreviewingLang(code);
    const stop = () => setPreviewingLang((cur) => (cur === code ? null : cur));
    const previewLang = VOICE_RESUME_LANGUAGES.find((l) => l.code === code);

    const playRecordedClip = () => {
      const audio = new Audio(`/audio/voice-resume/${code}.mp3`);
      audio.addEventListener("ended", stop);
      audio.addEventListener("error", () => setTimeout(stop, 1400));
      audio.play().catch(() => setTimeout(stop, 1400));
      setTimeout(stop, 6000);
    };

    const speakBrowserVoice = () => {
      if (!previewLang || typeof window === "undefined" || !window.speechSynthesis) {
        playRecordedClip();
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(previewLang.previewText);
      utterance.lang = previewLang.speechLang;
      utterance.onend = stop;
      utterance.onerror = playRecordedClip;
      window.speechSynthesis.speak(utterance);
      setTimeout(stop, 6000);
    };

    const isMobile =
      typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod|Mobile|IEMobile/i.test(navigator.userAgent);
    const hasVoice =
      typeof window !== "undefined" &&
      !!window.speechSynthesis &&
      window.speechSynthesis.getVoices().some((v) => v.lang.toLowerCase().startsWith(code.toLowerCase()));

    if (isMobile || hasVoice) speakBrowserVoice();
    else playRecordedClip();
  };

  // Kicks off async voice-list loading so hasVoice above has data by the
  // time the candidate reaches the language step.
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Done-screen stats from what was actually extracted.
  const doneStats = (() => {
    const emp = answers.EMPLOYMENT?.extracted_json?.employment?.length ?? 0;
    const edu = answers.EDUCATION?.extracted_json?.education?.length ?? 0;
    const skl = answers.SKILLS?.extracted_json?.skills?.length ?? 0;
    return { emp, edu, skl };
  })();

  const extractedView = (() => {
    const data = currentAnswer?.extracted_json;
    if (!question || !data) return null;
    switch (question.key) {
      case "EMPLOYMENT":
        return { jobs: data.employment ?? [] };
      case "EDUCATION":
        return {
          fields: (data.education ?? []).map((e) => ({
            label: e.qualification ?? "—",
            value: e.institution,
          })),
        };
      case "SKILLS":
        return { skills: data.skills ?? [] };
      case "FULL_NAME":
        return { fields: [{ label: t("voiceResume.extract.fullName"), value: data.full_name ?? null }] };
      case "LOCATION":
        return { fields: [{ label: t("voiceResume.extract.location"), value: data.location ?? null }] };
      case "EXPECTED_SALARY":
        return {
          fields: [
            {
              label: t("voiceResume.extract.expectedSalary"),
              value: data.expected_salary != null ? String(data.expected_salary) : null,
            },
          ],
        };
      default:
        return null;
    }
  })();

  return (
    <div className="vr-flow-card">
      {step === "entry" && (
        <>
          <div className="vr-hero">
            <div className="vr-mic-big">🎙️</div>
            <h2>{t("voiceResume.entry.heading")}</h2>
            <p>{t("voiceResume.entry.subtitle")}</p>
          </div>
          <ul className="vr-points">
            <li><span className="vr-tick">✓</span> {t("voiceResume.entry.point1")}</li>
            <li><span className="vr-tick">✓</span> {t("voiceResume.entry.point2")}</li>
            <li><span className="vr-tick">✓</span> {t("voiceResume.entry.point3")}</li>
          </ul>
          <div className="vr-btn-row">
            <button type="button" className="btn-solid" onClick={() => setStep("lang")}>
              {t("voiceResume.entry.start")}
            </button>
            <Link href={ROUTES.journey} className="vr-btn-ghost" style={{ textAlign: "center" }}>
              {t("voiceResume.entry.skip")}
            </Link>
          </div>
        </>
      )}

      {step === "lang" && (
        <>
          <h1 className="vr-title">{t("voiceResume.lang.title")}</h1>
          <p className="vr-sub">{t("voiceResume.lang.subtitle")}</p>
          <div className="vr-lang-grid">
            {VOICE_RESUME_LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                className={`vr-lang-card ${l.code === lang ? "vr-selected" : ""}`}
                onClick={() => setLang(l.code as VoiceResumeLanguageCode)}
              >
                <span className="vr-native" dir={l.rtl ? "rtl" : undefined}>{l.native}</span>
                <span className="vr-roman">{l.roman}</span>
                <span
                  className="vr-listen"
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    previewLanguage(l.code);
                  }}
                >
                  {previewingLang === l.code ? t("voiceResume.lang.listening") : t("voiceResume.lang.listen")}
                </span>
              </button>
            ))}
          </div>
          {flowError && <p className="vr-error">{flowError}</p>}
          <div className="vr-btn-row">
            <button type="button" className="btn-solid" disabled={busy} onClick={startSession}>
              {busy ? "…" : t("voiceResume.lang.continue")}
            </button>
          </div>
        </>
      )}

      {step === "perm" && (
        <>
          <div className="vr-perm-card">
            <div className="vr-mic-ring">🎤</div>
            <h2>{t("voiceResume.perm.heading")}</h2>
            <p>{t("voiceResume.perm.subtitle")}</p>
            {/* Draft consent copy — pending legal review, see sprint plan */}
            <p className="vr-consent">{t("voiceResume.perm.consent")}</p>
          </div>
          <div className="vr-btn-row">
            <button type="button" className="btn-solid" onClick={requestMic}>
              {t("voiceResume.perm.allow")}
            </button>
          </div>
        </>
      )}

      {step === "denied" && (
        <>
          <h1 className="vr-title">{t("voiceResume.denied.title")}</h1>
          <p className="vr-sub">{t("voiceResume.denied.subtitle")}</p>
          <ul className="vr-denied-list">
            <li><span className="vr-n">1</span> {t("voiceResume.denied.step1")}</li>
            <li><span className="vr-n">2</span> {t("voiceResume.denied.step2")}</li>
            <li><span className="vr-n">3</span> {t("voiceResume.denied.step3")}</li>
          </ul>
          <div className="vr-btn-row">
            <button type="button" className="btn-solid" onClick={() => setStep("perm")}>
              {t("voiceResume.denied.retry")}
            </button>
            <Link href={ROUTES.profile} className="btn-outline" style={{ textAlign: "center" }}>
              {t("voiceResume.denied.typeInstead")}
            </Link>
          </div>
        </>
      )}

      {step === "question" && question && (
        <>
          <ProgressRow total={questions.length} qIndex={qIndex} />
          <div className="vr-q-count">
            {t("voiceResume.question.count", { current: qIndex + 1, total: questions.length })}
          </div>
          <p className="vr-q-text" dir={currentLang.rtl ? "rtl" : "ltr"}>{question.text}</p>
          <p className="vr-q-hint">{t("voiceResume.question.hint")}</p>
          <button
            type="button"
            className="vr-lang-chip"
            disabled={recording}
            onClick={() => speakQuestion(question)}
          >
            {t("voiceResume.question.listen")}
          </button>
          <div className="vr-rec-zone">
            <button
              type="button"
              className={`vr-rec-btn ${recording ? "vr-recording" : ""}`}
              onClick={toggleRecording}
              aria-label={recording ? t("voiceResume.question.stopAria") : t("voiceResume.question.startAria")}
            >
              {recording ? "⏹" : "🎙️"}
            </button>
            <div className={`vr-wave ${recording ? "vr-on" : ""}`}>
              {Array.from({ length: 9 }, (_, i) => <i key={i} />)}
            </div>
            <div className="vr-rec-label">
              {recording ? t("voiceResume.question.recordingLabel") : t("voiceResume.question.idleLabel")}
            </div>
            <div className="vr-rec-timer">{fmtSec(seconds)}</div>
            <div className="vr-rec-cap">{t("voiceResume.question.max", { time: fmtSec(question.max_duration_sec) })}</div>
          </div>
        </>
      )}

      {step === "recorded" && question && (
        <>
          <ProgressRow total={questions.length} qIndex={qIndex} />
          <div className="vr-q-count">
            {t("voiceResume.question.count", { current: qIndex + 1, total: questions.length })}
          </div>
          <p className="vr-q-text" dir={currentLang.rtl ? "rtl" : "ltr"}>{question.text}</p>
          <div className="vr-playback">
            {recordedUrl ? (
              <audio controls src={recordedUrl} style={{ width: "100%" }} aria-label={t("voiceResume.recorded.playAria")} />
            ) : (
              <div className="vr-dur">{fmtSec(recordedDur)}</div>
            )}
          </div>
          {flowError && <p className="vr-error">{flowError}</p>}
          <div className="vr-btn-row">
            <button type="button" className="btn-solid" onClick={startProcessing}>
              {t("voiceResume.recorded.confirm")}
            </button>
            <button type="button" className="btn-outline" onClick={() => goToQuestion(qIndex)}>
              {t("voiceResume.recorded.reRecord")}
            </button>
          </div>
        </>
      )}

      {(step === "uploading" || step === "transcribing" || step === "committing") && (
        <div className="vr-proc">
          <div className="vr-spinner" />
          <h2>
            {step === "uploading" && t("voiceResume.processing.uploadingTitle")}
            {step === "transcribing" && t("voiceResume.processing.transcribingTitle")}
            {step === "committing" && t("voiceResume.processing.committingTitle")}
          </h2>
          <p>
            {step === "uploading" && t("voiceResume.processing.uploadingBody")}
            {step === "transcribing" && t("voiceResume.processing.transcribingBody")}
            {step === "committing" && t("voiceResume.processing.committingBody")}
          </p>
        </div>
      )}

      {step === "review" && question && (
        <>
          <ProgressRow total={questions.length} qIndex={qIndex} />
          <div className="vr-q-count">
            {t("voiceResume.question.count", { current: qIndex + 1, total: questions.length })}
          </div>
          <div className="vr-heard">{t("voiceResume.review.heard")}</div>
          <div className="vr-review-box">
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              aria-label={t("voiceResume.review.transcriptAria")}
            />
          </div>
          <p className="vr-edit-hint">{t("voiceResume.review.editHint")}</p>
          {flowError && <p className="vr-error">{flowError}</p>}
          <div className="vr-btn-row">
            <button type="button" className="btn-solid" disabled={busy} onClick={handleConfirmTranscript}>
              {busy ? "…" : t("voiceResume.review.confirm")}
            </button>
            <button type="button" className="btn-outline" disabled={busy} onClick={() => goToQuestion(qIndex)}>
              {t("voiceResume.review.reRecord")}
            </button>
          </div>
        </>
      )}

      {step === "extract" && question && (
        <>
          <ProgressRow total={questions.length} qIndex={qIndex} />
          <div className="vr-q-count">
            {t("voiceResume.question.count", { current: qIndex + 1, total: questions.length })}
          </div>
          <div className="vr-heard">{t("voiceResume.extract.heading")}</div>
          <div className="vr-ext-card">
            {extractedView?.jobs?.map((job, i) => (
              <div key={`${job.company_name ?? "job"}-${i}`} className="vr-job-row">
                <div className="vr-k">{t("voiceResume.extract.company")}</div>
                <div className="vr-v">{job.company_name ?? "—"}</div>
                <div className="vr-k" style={{ marginTop: 6 }}>{t("voiceResume.extract.roleYears")}</div>
                <div className="vr-v">
                  {job.role ?? "—"}
                  {job.duration_years != null ? ` · ${job.duration_years} yrs` : ""}
                </div>
              </div>
            ))}
            {extractedView?.skills && (
              <>
                <div className="vr-k" style={{ marginBottom: 8 }}>{t("voiceResume.extract.skills")}</div>
                <div className="vr-chips">
                  {extractedView.skills.map((s) => <span key={s} className="vr-chip">{s}</span>)}
                </div>
              </>
            )}
            {extractedView?.fields?.map((f, i) => (
              <div key={f.label + i}>
                {i > 0 && <div className="vr-field-gap" />}
                <div className="vr-k">{f.label}</div>
                <div className={`vr-v ${f.value ? "" : "vr-na"}`}>{f.value ?? t("voiceResume.extract.notMentioned")}</div>
              </div>
            ))}
            {!extractedView && <div className="vr-v vr-na">{t("voiceResume.extract.notMentioned")}</div>}
          </div>
          {flowError && <p className="vr-error">{flowError}</p>}
          <div className="vr-btn-row">
            <button type="button" className="btn-solid" onClick={handleNext}>
              {isLast ? t("voiceResume.extract.finish") : t("voiceResume.extract.next")}
            </button>
            <button type="button" className="vr-btn-ghost" onClick={openReview}>
              {t("voiceResume.extract.editTranscript")}
            </button>
          </div>
        </>
      )}

      {step === "done" && (
        <div className="vr-done">
          <div className="vr-big-tick">✓</div>
          <h2>{t("voiceResume.done.title")}</h2>
          <p>{t("voiceResume.done.subtitle")}</p>
          <div className="vr-stats">
            <div className="vr-stat"><div className="vr-n">{doneStats.emp}</div><div className="vr-l">{t("voiceResume.done.jobs")}</div></div>
            <div className="vr-stat"><div className="vr-n">{doneStats.edu}</div><div className="vr-l">{t("voiceResume.done.education")}</div></div>
            <div className="vr-stat"><div className="vr-n">{doneStats.skl}</div><div className="vr-l">{t("voiceResume.done.skills")}</div></div>
          </div>
          <div className="vr-pdf-row">
            <div className="vr-file-ic">PDF</div>
            <div>
              <div className="vr-name">{t("voiceResume.done.pdfReady")}</div>
              <div className="vr-subm">{t("voiceResume.done.madeWithVoice", { lang: currentLang.roman })}</div>
            </div>
          </div>
          <div className="vr-btn-row">
            <Link href={ROUTES.profileResume} className="btn-solid" style={{ textAlign: "center" }}>
              {t("voiceResume.done.viewProfile")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
