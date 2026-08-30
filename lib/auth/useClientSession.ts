"use client";

import { useEffect, useState } from "react";
import { STORAGE_KEY, type CandidateSession } from "./session";

// Public pages don't run PersistGate (see lib/store/SessionGate.tsx — scoped
// to the authenticated (app) area only, so public pages keep server-rendering
// real HTML for crawlers instead of an empty shell). So a public page can't
// read Redux for auth state; it reads the same raw storage key directly
// instead, client-side only after mount — SSR and the first paint always
// render logged-out, then this corrects itself a moment later for a visitor
// who's actually signed in. Same pattern Header.tsx already uses.
export function useClientSession(): CandidateSession | null {
  const [session, setSession] = useState<CandidateSession | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY) || window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) setSession(JSON.parse(raw));
    } catch {
      // Malformed storage — treat as logged out rather than throwing.
    }
  }, []);

  return session;
}
