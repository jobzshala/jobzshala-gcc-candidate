"use client";

import { Provider } from "react-redux";
import { store } from "./store";

// Wraps the whole app (see app/layout.tsx) so any page can dispatch and read
// Redux. Rehydration is NOT gated here — see lib/store/SessionGate.tsx for why
// that gate lives in the authenticated areas instead (gating the root would
// leave every public page server-rendering an empty shell).
export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
