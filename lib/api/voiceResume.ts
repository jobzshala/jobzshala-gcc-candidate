import { authFetch, authFetchEnvelope } from "./client";

// Client for the v3 voice-resume endpoints (backend:
// src/modules/v3/voice-resumes/) — session lifecycle, per-question audio
// answers (transcribed + extracted synchronously server-side), transcript
// edits (which re-run extraction), and the final commit that writes the
// profile and generates the PDF.

export type VoiceResumeQuestionKey =
  | "FULL_NAME"
  | "LOCATION"
  | "EMPLOYMENT"
  | "EDUCATION"
  | "SKILLS"
  | "EXPECTED_SALARY";

export type VoiceResumeLanguageCode = "hi" | "en" | "ar" | "kn" | "ta" | "ml" | "te";

export interface VoiceResumeQuestion {
  key: VoiceResumeQuestionKey;
  sequence: number;
  max_duration_sec: number;
  /** Question text already translated to the session's ui_language. */
  text: string;
}

export type AnswerProcessStatus = "PENDING" | "PROCESSING" | "DONE" | "FAILED";

// extracted_json shape varies by question — see the backend's
// voice-resume-extraction service. Narrowed per key at render time.
export interface ExtractedEmployment {
  company_name: string | null;
  role: string | null;
  duration_years: number | null;
}
export interface ExtractedEducation {
  qualification: string | null;
  institution: string | null;
}
export type ExtractedJson = {
  full_name?: string | null;
  location?: string | null;
  employment?: ExtractedEmployment[];
  education?: ExtractedEducation[];
  skills?: string[];
  expected_salary?: number | null;
} | null;

export interface VoiceResumeAnswer {
  answer_id: number;
  question_key: VoiceResumeQuestionKey;
  transcription_status: AnswerProcessStatus;
  extraction_status: AnswerProcessStatus;
  transcript_raw: string | null;
  transcript_edited?: string | null;
  extracted_json: ExtractedJson;
  was_edited?: boolean;
}

export interface VoiceResumeSession {
  session_id: number;
  status: "IN_PROGRESS" | "COMMITTED" | "ABANDONED" | "EXPIRED";
  ui_language: VoiceResumeLanguageCode;
  current_question_key: VoiceResumeQuestionKey;
  /** Existing answers when resuming an in-progress session (newest first). */
  answers: {
    id: number;
    question_key: VoiceResumeQuestionKey;
    transcription_status: AnswerProcessStatus;
    extraction_status: AnswerProcessStatus;
    transcript_raw: string | null;
    transcript_edited: string | null;
    extracted_json: ExtractedJson;
  }[];
  questions: VoiceResumeQuestion[];
}

// Creates a session, or transparently resumes the candidate's existing
// IN_PROGRESS one (the response's answers array carries prior progress).
// NOTE: a resumed session keeps its ORIGINAL ui_language — the questions it
// returns ignore the language passed here. Callers wanting a different
// display language should re-fetch via getQuestions() below.
export function createOrResumeSession(uiLanguage: VoiceResumeLanguageCode): Promise<VoiceResumeSession> {
  return authFetch<VoiceResumeSession>("/candidate/voice-resume/session", {
    method: "POST",
    body: JSON.stringify({ ui_language: uiLanguage }),
  });
}

// The six questions translated to any language, independent of any session.
export async function getQuestions(language: VoiceResumeLanguageCode): Promise<VoiceResumeQuestion[]> {
  const result = await authFetch<{ questions: VoiceResumeQuestion[] }>(
    `/candidate/voice-resume/questions?language=${language}`
  );
  return result.questions;
}

// Uploads one question's audio answer. The backend transcribes and extracts
// synchronously, so the DONE/FAILED statuses and transcript come back in
// this same response — no polling needed.
export function uploadAnswer(params: {
  sessionId: number;
  questionKey: VoiceResumeQuestionKey;
  spokenLanguage: VoiceResumeLanguageCode;
  audio: Blob;
  filename: string;
}): Promise<VoiceResumeAnswer> {
  const formData = new FormData();
  formData.set("session_id", String(params.sessionId));
  formData.set("question_key", params.questionKey);
  formData.set("spoken_language", params.spokenLanguage);
  formData.set("audio", params.audio, params.filename);
  return authFetch<VoiceResumeAnswer>("/candidate/voice-resume/answers", {
    method: "POST",
    body: formData,
  });
}

// Saves a candidate's manual transcript correction; the backend re-runs
// extraction on the edited text and returns the fresh extracted_json.
export function updateAnswerTranscript(answerId: number, transcriptEdited: string): Promise<VoiceResumeAnswer> {
  return authFetch<VoiceResumeAnswer>(`/candidate/voice-resume/answers/${answerId}`, {
    method: "PATCH",
    body: JSON.stringify({ transcript_edited: transcriptEdited }),
  });
}

// Re-uploads audio for an answer whose transcription/extraction FAILED.
export function retryAnswer(answerId: number, audio: Blob, filename: string): Promise<VoiceResumeAnswer> {
  const formData = new FormData();
  formData.set("audio", audio, filename);
  return authFetch<VoiceResumeAnswer>(`/candidate/voice-resume/answers/${answerId}/retry`, {
    method: "POST",
    body: formData,
  });
}

// Writes the extracted data into the candidate's profile and generates the
// PDF resume. The result rides on `data` (not `result`) in this endpoint's
// envelope, so success here is simply "didn't throw".
export async function commitSession(sessionId: number): Promise<void> {
  await authFetchEnvelope(`/candidate/voice-resume/session/${sessionId}/commit`, { method: "POST" });
}

export async function abandonSession(sessionId: number): Promise<void> {
  await authFetchEnvelope(`/candidate/voice-resume/session/${sessionId}/abandon`, { method: "POST" });
}
