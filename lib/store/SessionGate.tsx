"use client";

import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./store";
import AppLoader from "@/components/ui/AppLoader";

/**
 * Holds rendering until redux-persist has rehydrated the auth session, so the
 * subtree can read it synchronously without a per-page "checking" state.
 *
 * Deliberately scoped to authenticated areas rather than the whole app: a
 * PersistGate renders only its fallback on the server (rehydration is
 * client-only), so wrapping the root would leave every public page's HTML
 * empty — fine for browsers, fatal for crawlers that don't execute JS, which
 * includes most AI answer-engine bots. Public pages therefore render on the
 * server and don't need the session at all.
 */
export default function SessionGate({ children }: { children: React.ReactNode }) {
  return (
    <PersistGate loading={<AppLoader />} persistor={persistor}>
      {children}
    </PersistGate>
  );
}
