"use client";

/**
 * Voice Resume Builder — STATIC UI phase.
 *
 * The full candidate flow (language select → 6 spoken questions → transcript
 * review → extraction preview → done) running entirely on dummy data from
 * lib/voiceResume/questions.ts. No API calls, no real microphone capture —
 * recording/upload/transcription are simulated with timers so every screen
 * and state is reviewable end-to-end.
 *
 * Integration plan (VOICE-RESUME-BUILDER-SPRINT-PLAN.md): the simulated
 * pieces map 1:1 onto the pending backend — startProcessing() becomes
 * POST /candidate/voice-resume/answers, DUMMY_ANSWERS becomes the
 * transcription/extraction response, handleCommit() becomes
 * POST /candidate/voice-resume/session/{id}/commit, and the fake recorder
 * becomes a MediaRecorder clone of components/profile/VideoSection.tsx.
 */

import "./voice-resume.css";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ROUTES } from "@/lib/routes";
import {
  VOICE_RESUME_LANGUAGES,
  VOICE_RESUME_QUESTIONS,
  DUMMY_ANSWERS,
  type VoiceResumeQuestionKey,
} from "@/lib/voiceResume/questions";

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

function ProgressRow({ qIndex }: { qIndex: number }) {
  return (
    <div className="vr-progress">
      {VOICE_RESUME_QUESTIONS.map((q, i) => (
        <div key={q.key} className={`vr-seg ${i < qIndex ? "vr-done" : i === qIndex ? "vr-now" : ""}`} />
      ))}
    </div>
  );
}

function StaticNote() {
  const { t } = useTranslation();
  return <div className="vr-static-note">{t("voiceResume.staticNote")}</div>;
}

export default function VoiceResumePage() {
  const { t } = useTranslation();
  const [step, setStep] = useState<FlowStep>("entry");
  const [lang, setLang] = useState("hi");
  const [qIndex, setQIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [recordedDur, setRecordedDur] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [previewingLang, setPreviewingLang] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const question = VOICE_RESUME_QUESTIONS[qIndex];
  const questionText = question.text[lang] ?? question.text.en;
  const currentLang = VOICE_RESUME_LANGUAGES.find((l) => l.code === lang) ?? VOICE_RESUME_LANGUAGES[0];
  const isLast = qIndex === VOICE_RESUME_QUESTIONS.length - 1;
  const dummy = DUMMY_ANSWERS[question.key as VoiceResumeQuestionKey];

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const goToQuestion = (index: number) => {
    stopTimer();
    setRecording(false);
    setSeconds(0);
    setQIndex(index);
    setStep("question");
  };

  const toggleRecording = () => {
    if (!recording) {
      setRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s + 1 >= question.maxDurationSec) {
            stopTimer();
            setRecording(false);
            setRecordedDur(s + 1);
            setStep("recorded");
          }
          return s + 1;
        });
      }, 1000);
    } else {
      stopTimer();
      setRecording(false);
      setRecordedDur(Math.max(seconds, 4));
      setStep("recorded");
    }
  };

  // Simulated upload → transcription. Becomes one POST /answers call (which
  // transcribes + extracts synchronously server-side) at integration time.
  const startProcessing = () => {
    setStep("uploading");
    setTimeout(() => {
      setStep("transcribing");
      setTimeout(() => {
        setTranscript(dummy.transcript);
        setStep("review");
      }, 1400);
    }, 900);
  };

  const handleConfirmTranscript = () => setStep("extract");

  const handleNext = () => {
    if (isLast) {
      setStep("committing");
      setTimeout(() => setStep("done"), 2000);
    } else {
      goToQuestion(qIndex + 1);
    }
  };

  // Speaks a short "you can speak in this language" line live via the
  // browser's built-in SpeechSynthesis API — no audio files to record or
  // host. Falls back to a bare 1.4s "🔊 …" pulse (same as the original
  // static-preview placeholder) when the browser has no speech synthesis
  // support or no voice installed for that language, so nothing breaks.
  const previewLanguage = (code: string) => {
    setPreviewingLang(code);
    const stop = () => setPreviewingLang((cur) => (cur === code ? null : cur));
    const previewLang = VOICE_RESUME_LANGUAGES.find((l) => l.code === code);
    if (!previewLang || typeof window === "undefined" || !window.speechSynthesis) {
      setTimeout(stop, 1400);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(previewLang.previewText);
    utterance.lang = previewLang.speechLang;
    utterance.onend = stop;
    utterance.onerror = stop;
    window.speechSynthesis.speak(utterance);
    // Safety net in case neither event fires — caps how long the
    // "listening" pill can show.
    setTimeout(stop, 6000);
  };

  return (
    <div className="vr-flow-card">
      {step === "entry" && (
        <>
          <StaticNote />
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
                onClick={() => setLang(l.code)}
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
          <div className="vr-btn-row">
            <button type="button" className="btn-solid" onClick={() => setStep("perm")}>
              {t("voiceResume.lang.continue")}
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
            <button type="button" className="btn-solid" onClick={() => goToQuestion(0)}>
              {t("voiceResume.perm.allow")}
            </button>
            <button type="button" className="vr-btn-ghost" onClick={() => setStep("denied")}>
              {t("voiceResume.perm.denySimulate")}
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

      {step === "question" && (
        <>
          <ProgressRow qIndex={qIndex} />
          <div className="vr-q-count">
            {t("voiceResume.question.count", { current: qIndex + 1, total: VOICE_RESUME_QUESTIONS.length })}
          </div>
          <p className="vr-q-text" dir={currentLang.rtl ? "rtl" : "ltr"}>{questionText}</p>
          <p className="vr-q-hint">{t("voiceResume.question.hint")}</p>
          <button type="button" className="vr-lang-chip" onClick={() => setStep("lang")}>
            {t("voiceResume.question.changeLang", { lang: currentLang.native })}
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
            <div className="vr-rec-cap">{t("voiceResume.question.max", { time: fmtSec(question.maxDurationSec) })}</div>
          </div>
        </>
      )}

      {step === "recorded" && (
        <>
          <ProgressRow qIndex={qIndex} />
          <div className="vr-q-count">
            {t("voiceResume.question.count", { current: qIndex + 1, total: VOICE_RESUME_QUESTIONS.length })}
          </div>
          <p className="vr-q-text" dir={currentLang.rtl ? "rtl" : "ltr"}>{questionText}</p>
          <div className="vr-playback">
            <button
              type="button"
              className="vr-play"
              aria-label={t("voiceResume.recorded.playAria")}
              disabled
              title="Static preview"
            >
              ▶
            </button>
            <div className="vr-bar"><i /></div>
            <div className="vr-dur">{fmtSec(recordedDur)}</div>
          </div>
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

      {step === "review" && (
        <>
          <ProgressRow qIndex={qIndex} />
          <div className="vr-q-count">
            {t("voiceResume.question.count", { current: qIndex + 1, total: VOICE_RESUME_QUESTIONS.length })}
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
          <div className="vr-btn-row">
            <button type="button" className="btn-solid" onClick={handleConfirmTranscript}>
              {t("voiceResume.review.confirm")}
            </button>
            <button type="button" className="btn-outline" onClick={() => goToQuestion(qIndex)}>
              {t("voiceResume.review.reRecord")}
            </button>
          </div>
        </>
      )}

      {step === "extract" && (
        <>
          <ProgressRow qIndex={qIndex} />
          <div className="vr-q-count">
            {t("voiceResume.question.count", { current: qIndex + 1, total: VOICE_RESUME_QUESTIONS.length })}
          </div>
          <div className="vr-heard">{t("voiceResume.extract.heading")}</div>
          <div className="vr-ext-card">
            {dummy.jobs?.map((job) => (
              <div key={job.company} className="vr-job-row">
                <div className="vr-k">{t("voiceResume.extract.company")}</div>
                <div className="vr-v">{job.company}</div>
                <div className="vr-k" style={{ marginTop: 6 }}>{t("voiceResume.extract.roleYears")}</div>
                <div className="vr-v">{job.role} · {job.years}</div>
              </div>
            ))}
            {dummy.skills && (
              <>
                <div className="vr-k" style={{ marginBottom: 8 }}>{t("voiceResume.extract.skills")}</div>
                <div className="vr-chips">
                  {dummy.skills.map((s) => <span key={s} className="vr-chip">{s}</span>)}
                </div>
              </>
            )}
            {dummy.fields?.map((f, i) => (
              <div key={f.label}>
                {i > 0 && <div className="vr-field-gap" />}
                <div className="vr-k">{f.label}</div>
                <div className={`vr-v ${f.value ? "" : "vr-na"}`}>{f.value ?? t("voiceResume.extract.notMentioned")}</div>
              </div>
            ))}
          </div>
          <div className="vr-btn-row">
            <button type="button" className="btn-solid" onClick={handleNext}>
              {isLast ? t("voiceResume.extract.finish") : t("voiceResume.extract.next")}
            </button>
            <button type="button" className="vr-btn-ghost" onClick={() => setStep("review")}>
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
            <div className="vr-stat"><div className="vr-n">2</div><div className="vr-l">{t("voiceResume.done.jobs")}</div></div>
            <div className="vr-stat"><div className="vr-n">1</div><div className="vr-l">{t("voiceResume.done.education")}</div></div>
            <div className="vr-stat"><div className="vr-n">3</div><div className="vr-l">{t("voiceResume.done.skills")}</div></div>
          </div>
          <div className="vr-pdf-row">
            <div className="vr-file-ic">PDF</div>
            <div>
              <div className="vr-name">Ramesh_Kumar_Resume.pdf</div>
              <div className="vr-subm">{t("voiceResume.done.madeWithVoice", { lang: currentLang.roman })}</div>
            </div>
          </div>
          <div className="vr-btn-row">
            <Link href={ROUTES.profile} className="btn-solid" style={{ textAlign: "center" }}>
              {t("voiceResume.done.viewProfile")}
            </Link>
            <button
              type="button"
              className="vr-btn-ghost"
              onClick={() => {
                setQIndex(0);
                setStep("entry");
              }}
            >
              {t("voiceResume.done.restart")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
