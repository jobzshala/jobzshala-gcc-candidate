import type { CandidateSummary } from "../api/auth";

const STORAGE_KEY = "jobzshala-candidate-session";

export interface CandidateSession {
  accessToken: string;
  refreshToken: string;
  candidate: CandidateSummary;
}

export function saveSession(session: CandidateSession, persist: boolean = true) {
  const store = persist ? window.localStorage : window.sessionStorage;
  const other = persist ? window.sessionStorage : window.localStorage;
  other.removeItem(STORAGE_KEY);
  store.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function getSession(): CandidateSession | null {
  const raw = window.localStorage.getItem(STORAGE_KEY) ?? window.sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CandidateSession;
  } catch {
    return null;
  }
}

export function clearSession() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.sessionStorage.removeItem(STORAGE_KEY);
}
