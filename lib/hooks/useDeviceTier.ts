"use client";

import { useEffect, useState } from "react";

export type DeviceTier = "mobile" | "tabletDesktop";

const QUERY = "(min-width: 768px)";

// First JS-driven breakpoint hook in this codebase (everywhere else uses
// CSS-only `hidden md:block` toggles) — a deliberate exception for the
// profile page specifically: mounting both the wizard and the tabbed shell
// at once would double DOM nodes, fetches, and per-step form state on a
// page whose whole point is staying light on low-end Android devices.
//
// Returns null until the client has actually measured the viewport, so the
// caller can render a lightweight skeleton on the first client render
// instead of guessing — matchMedia isn't available during SSR/the initial
// hydration pass, and guessing wrong would mean a visible shell swap.
export function useDeviceTier(): DeviceTier | null {
  const [tier, setTier] = useState<DeviceTier | null>(null);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const update = () => setTier(mql.matches ? "tabletDesktop" : "mobile");
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return tier;
}
