"use client";

import { useMemo, useSyncExternalStore } from "react";
import { readStoredSession, subscribeToSession, type CandidateSession } from "./session";

// Public pages don't run PersistGate (see lib/store/SessionGate.tsx — scoped
// to the authenticated (app) area only, so public pages keep server-rendering
// real HTML for crawlers instead of an empty shell). So a public page can't
// read Redux for auth state; it reads the same raw storage key directly
// instead, client-side only. The server snapshot is null, so SSR and
// hydration always render logged-out; the client snapshot then takes over
// for a visitor who's actually signed in, and same-tab login/logout
// (saveSession/clearSession) re-renders subscribers immediately.
export function useClientSession(): CandidateSession | null {
  const raw = useSyncExternalStore(subscribeToSession, readStoredSession, () => null);

  return useMemo<CandidateSession | null>(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as CandidateSession;
    } catch {
      // Malformed storage — treat as logged out rather than throwing.
      return null;
    }
  }, [raw]);
}
