// redux-persist storage engine that mirrors the "keep me signed in" choice
// on the login form: localStorage when persist=true, sessionStorage
// (this-tab-only) when false. A tiny separate flag in localStorage records
// which store is currently active, since redux-persist's storage interface
// doesn't take that as a parameter — call setPersistMode() before the first
// persisted write (see app/login/page.tsx).
const MODE_KEY = "jobzshala-candidate-session-mode";

const activeStore = (): Storage | null => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(MODE_KEY) === "session" ? window.sessionStorage : window.localStorage;
};

export const setPersistMode = (persist: boolean) => {
  window.localStorage.setItem(MODE_KEY, persist ? "local" : "session");
};

// The next/redux-persist pairing evaluates this module during Next.js's
// server-side render of the client component tree, before window exists —
// every method has to tolerate that (redux-persist just gets null/no-op and
// rehydrates for real once running in the browser) instead of throwing.
const dualStorage = {
  getItem(key: string): Promise<string | null> {
    return Promise.resolve(activeStore()?.getItem(key) ?? null);
  },
  setItem(key: string, value: string): Promise<void> {
    activeStore()?.setItem(key, value);
    return Promise.resolve();
  },
  removeItem(key: string): Promise<void> {
    // Clear both stores so switching modes never leaves a stale copy behind.
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
      window.sessionStorage.removeItem(key);
    }
    return Promise.resolve();
  },
};

export default dualStorage;
