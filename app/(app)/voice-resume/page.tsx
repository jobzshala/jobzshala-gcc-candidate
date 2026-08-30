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
  return <div className="vr-static-note">⚠ Static preview — dummy data, no real recording/upload yet</div>;
}

export default function VoiceResumePage() {
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

  const previewLanguage = (code: string) => {
    setPreviewingLang(code);
    setTimeout(() => setPreviewingLang(null), 1400);
  };

  return (
    <div className="vr-flow-card">
      {step === "entry" && (
        <>
          <StaticNote />
          <div className="vr-hero">
            <div className="vr-mic-big">🎙️</div>
            <h2>Banaayein apna resume awaaz se?</h2>
            <p>Sirf 6 sawaalon ke jawab boliye — typing ki zaroorat nahi. 2 minute mein resume ready.</p>
          </div>
          <ul className="vr-points">
            <li><span className="vr-tick">✓</span> Apni bhasha mein boliye — Hindi, English, Tamil, Telugu…</li>
            <li><span className="vr-tick">✓</span> Profile + PDF resume dono ban jaayenge</li>
            <li><span className="vr-tick">✓</span> Galti hui to sudharne ka mauka milega</li>
          </ul>
          <div className="vr-btn-row">
            <button type="button" className="btn-solid" onClick={() => setStep("lang")}>
              🎤 &nbsp;Start karein
            </button>
            <Link href={ROUTES.journey} className="vr-btn-ghost" style={{ textAlign: "center" }}>
              Skip for now
            </Link>
          </div>
        </>
      )}

      {step === "lang" && (
        <>
          <h1 className="vr-title">Aap kis bhasha mein bol sakte hain?</h1>
          <p className="vr-sub">Jo bhasha aap aaraam se bolte hain, woh chuniye. Site ki bhasha se alag ho sakti hai.</p>
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
                  {previewingLang === l.code ? "🔊 …" : "🔊 Suniye"}
                </span>
              </button>
            ))}
          </div>
          <div className="vr-btn-row">
            <button type="button" className="btn-solid" onClick={() => setStep("perm")}>
              Aage badhein →
            </button>
          </div>
        </>
      )}

      {step === "perm" && (
        <>
          <div className="vr-perm-card">
            <div className="vr-mic-ring">🎤</div>
            <h2>Microphone ki permission chahiye</h2>
            <p>Aapke jawab record karne ke liye phone ke mic ki zaroorat hai.</p>
            {/* Draft consent copy — pending legal review, see sprint plan */}
            <p className="vr-consent">
              Aapki voice recording sirf resume banane ke liye process hogi. Recording surakshit rakhi jaati hai.
            </p>
          </div>
          <div className="vr-btn-row">
            <button type="button" className="btn-solid" onClick={() => goToQuestion(0)}>
              Allow microphone
            </button>
            <button type="button" className="vr-btn-ghost" onClick={() => setStep("denied")}>
              Deny (simulate)
            </button>
          </div>
        </>
      )}

      {step === "denied" && (
        <>
          <h1 className="vr-title">Koi baat nahi!</h1>
          <p className="vr-sub">
            Mic ki permission nahi mili — aap apna profile type karke bhi bana sakte hain, ya settings se mic allow kar
            sakte hain.
          </p>
          <ul className="vr-denied-list">
            <li><span className="vr-n">1</span> Browser settings kholiye</li>
            <li><span className="vr-n">2</span> Site permissions → Microphone → Allow</li>
            <li><span className="vr-n">3</span> Page reload karke dobara try kariye</li>
          </ul>
          <div className="vr-btn-row">
            <button type="button" className="btn-solid" onClick={() => setStep("perm")}>
              🎤 &nbsp;Dobara try karein
            </button>
            <Link href={ROUTES.profile} className="btn-outline" style={{ textAlign: "center" }}>
              ✏️ &nbsp;Type karke banayein
            </Link>
          </div>
        </>
      )}

      {step === "question" && (
        <>
          <ProgressRow qIndex={qIndex} />
          <div className="vr-q-count">Sawaal {qIndex + 1} / {VOICE_RESUME_QUESTIONS.length}</div>
          <p className="vr-q-text" dir={currentLang.rtl ? "rtl" : "ltr"}>{questionText}</p>
          <p className="vr-q-hint">🎤 Record dabakar boliye · phir Stop dabaiye</p>
          <button type="button" className="vr-lang-chip" onClick={() => setStep("lang")}>
            🌐 {currentLang.native} · badlein
          </button>
          <div className="vr-rec-zone">
            <button
              type="button"
              className={`vr-rec-btn ${recording ? "vr-recording" : ""}`}
              onClick={toggleRecording}
              aria-label={recording ? "Stop recording" : "Start recording"}
            >
              {recording ? "⏹" : "🎙️"}
            </button>
            <div className={`vr-wave ${recording ? "vr-on" : ""}`}>
              {Array.from({ length: 9 }, (_, i) => <i key={i} />)}
            </div>
            <div className="vr-rec-label">
              {recording ? "Bol rahe hain… rukne ke liye dabaiye" : "Bolne ke liye dabaiye"}
            </div>
            <div className="vr-rec-timer">{fmtSec(seconds)}</div>
            <div className="vr-rec-cap">max {fmtSec(question.maxDurationSec)}</div>
          </div>
        </>
      )}

      {step === "recorded" && (
        <>
          <ProgressRow qIndex={qIndex} />
          <div className="vr-q-count">Sawaal {qIndex + 1} / {VOICE_RESUME_QUESTIONS.length}</div>
          <p className="vr-q-text" dir={currentLang.rtl ? "rtl" : "ltr"}>{questionText}</p>
          <div className="vr-playback">
            <button type="button" className="vr-play" aria-label="Play recording" disabled title="Static preview">
              ▶
            </button>
            <div className="vr-bar"><i /></div>
            <div className="vr-dur">{fmtSec(recordedDur)}</div>
          </div>
          <div className="vr-btn-row">
            <button type="button" className="btn-solid" onClick={startProcessing}>
              ✓ &nbsp;Theek hai, aage badhein
            </button>
            <button type="button" className="btn-outline" onClick={() => goToQuestion(qIndex)}>
              ↻ &nbsp;Dobara boliye
            </button>
          </div>
        </>
      )}

      {(step === "uploading" || step === "transcribing" || step === "committing") && (
        <div className="vr-proc">
          <div className="vr-spinner" />
          <h2>
            {step === "uploading" && "Upload ho raha hai…"}
            {step === "transcribing" && "Sun rahe hain…"}
            {step === "committing" && "Resume ban raha hai…"}
          </h2>
          <p>
            {step === "uploading" && "Aapki recording bheji jaa rahi hai"}
            {step === "transcribing" && "Aapke jawab ko samjha jaa raha hai"}
            {step === "committing" && "Profile update + PDF generate ho rahi hai"}
          </p>
        </div>
      )}

      {step === "review" && (
        <>
          <ProgressRow qIndex={qIndex} />
          <div className="vr-q-count">Sawaal {qIndex + 1} / {VOICE_RESUME_QUESTIONS.length}</div>
          <div className="vr-heard">👂 Humne yeh suna — yeh sahi hai?</div>
          <div className="vr-review-box">
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              aria-label="Transcript"
            />
          </div>
          <p className="vr-edit-hint">Kuch galat suna? Text par tap karke seedha sudhaar dijiye.</p>
          <div className="vr-btn-row">
            <button type="button" className="btn-solid" onClick={handleConfirmTranscript}>
              ✓ &nbsp;Sahi hai
            </button>
            <button type="button" className="btn-outline" onClick={() => goToQuestion(qIndex)}>
              🎙️ &nbsp;Dobara record karein
            </button>
          </div>
        </>
      )}

      {step === "extract" && (
        <>
          <ProgressRow qIndex={qIndex} />
          <div className="vr-q-count">Sawaal {qIndex + 1} / {VOICE_RESUME_QUESTIONS.length}</div>
          <div className="vr-heard">✨ Yeh jaankari profile mein jayegi</div>
          <div className="vr-ext-card">
            {dummy.jobs?.map((job) => (
              <div key={job.company} className="vr-job-row">
                <div className="vr-k">Company</div>
                <div className="vr-v">{job.company}</div>
                <div className="vr-k" style={{ marginTop: 6 }}>Role · Kitne saal</div>
                <div className="vr-v">{job.role} · {job.years}</div>
              </div>
            ))}
            {dummy.skills && (
              <>
                <div className="vr-k" style={{ marginBottom: 8 }}>Skills</div>
                <div className="vr-chips">
                  {dummy.skills.map((s) => <span key={s} className="vr-chip">{s}</span>)}
                </div>
              </>
            )}
            {dummy.fields?.map((f, i) => (
              <div key={f.label}>
                {i > 0 && <div className="vr-field-gap" />}
                <div className="vr-k">{f.label}</div>
                <div className={`vr-v ${f.value ? "" : "vr-na"}`}>{f.value ?? "nahi bataya — khali rahega"}</div>
              </div>
            ))}
          </div>
          <div className="vr-btn-row">
            <button type="button" className="btn-solid" onClick={handleNext}>
              {isLast ? "✓ Resume banayein" : "Agla sawaal →"}
            </button>
            <button type="button" className="vr-btn-ghost" onClick={() => setStep("review")}>
              ‹ Transcript sudhaarein
            </button>
          </div>
        </>
      )}

      {step === "done" && (
        <div className="vr-done">
          <div className="vr-big-tick">✓</div>
          <h2>Aapka resume taiyaar hai! 🎉</h2>
          <p>Profile update ho gaya — sab kuch aapki awaaz se.</p>
          <div className="vr-stats">
            <div className="vr-stat"><div className="vr-n">2</div><div className="vr-l">Naukriyan</div></div>
            <div className="vr-stat"><div className="vr-n">1</div><div className="vr-l">Padhai</div></div>
            <div className="vr-stat"><div className="vr-n">3</div><div className="vr-l">Skills</div></div>
          </div>
          <div className="vr-pdf-row">
            <div className="vr-file-ic">PDF</div>
            <div>
              <div className="vr-name">Ramesh_Kumar_Resume.pdf</div>
              <div className="vr-subm">Voice se bana · English</div>
            </div>
          </div>
          <div className="vr-btn-row">
            <Link href={ROUTES.profile} className="btn-solid" style={{ textAlign: "center" }}>
              Profile dekhein
            </Link>
            <button
              type="button"
              className="vr-btn-ghost"
              onClick={() => {
                setQIndex(0);
                setStep("entry");
              }}
            >
              ↻ Dobara shuru karein
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
