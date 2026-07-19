import type { CandidateSummary } from "../api/auth";

export const STORAGE_KEY = "jobzshala-candidate-session";

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

// Which store the current session lives in — so a token refresh can re-save
// into the same place ("keep me signed in" vs. this-tab-only) instead of
// silently changing that choice.
export function isSessionPersisted(): boolean {
  return window.localStorage.getItem(STORAGE_KEY) !== null;
}

export function clearSession() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.sessionStorage.removeItem(STORAGE_KEY);
}
