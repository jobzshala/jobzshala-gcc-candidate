"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import AppLoader from "@/components/ui/AppLoader";

// Wraps the whole app (see app/layout.tsx). PersistGate's `loading` fallback
// only ever shows once, while redux-persist rehydrates auth state from
// storage on first boot — every page under this provider (including
// app/dashboard/layout.tsx) can then read the session synchronously from
// Redux with no per-page "checking" state of its own.
export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<AppLoader />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
