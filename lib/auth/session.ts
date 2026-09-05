import type { CandidateSummary } from "../api/auth";

export const STORAGE_KEY = "jobzshala-candidate-session";

export interface CandidateSession {
  accessToken: string;
  refreshToken: string;
  candidate: CandidateSummary;
}

// Same-tab listeners for the stored session. The browser's `storage` event
// only fires in *other* tabs, so components that read the raw key (see
// components/Header.tsx) also need to hear about writes made in this one.
const listeners = new Set<() => void>();

function notifySessionChanged() {
  listeners.forEach((listener) => listener());
}

// Subscribe/snapshot pair shaped for React's useSyncExternalStore. The
// snapshot is the raw stored string (or null) so React's equality check is a
// plain string compare; parse it in the component.
export function subscribeToSession(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function readStoredSession(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY) || window.sessionStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage blocked (privacy mode, sandboxed frame) — treat as logged out.
    return null;
  }
}

export function saveSession(session: CandidateSession, persist: boolean = true) {
  const store = persist ? window.localStorage : window.sessionStorage;
  const other = persist ? window.sessionStorage : window.localStorage;
  other.removeItem(STORAGE_KEY);
  store.setItem(STORAGE_KEY, JSON.stringify(session));
  notifySessionChanged();
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
  notifySessionChanged();
}
