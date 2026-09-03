"use client";

import { useEffect } from "react";

// Next.js App Router doesn't reliably auto-scroll to a #hash on the initial
// full-page load (a known rough edge — the browser's native fragment scroll
// races client hydration and loses). Section targets already carry
// scroll-mt-* (see WhyChooseUs/HowItWorks/VerifiedTrusted/
// WorkforceCorridor), so a plain scrollIntoView respects the sticky header
// offset with no extra math here.
export default function HashScrollFix() {
  useEffect(() => {
    if (!window.location.hash) return;

    const id = decodeURIComponent(window.location.hash.slice(1));
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return null;
}
