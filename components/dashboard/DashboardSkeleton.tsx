// Stands in for the real overview/profile page (app/(app)/journey/page.tsx,
// app/(app)/profile/page.tsx)
// while its five parallel API calls are in flight. Reuses the page's own
// layout classes (.hero, .journey/.steps, .card/.card-head) instead of
// hand-guessed placeholder blocks, so the skeleton's box model — padding,
// border-radius, card boundaries, the 8-step journey rail — is pixel-exact
// to what replaces it, not just roughly the same shape. Only the content
// inside each box (bars instead of text, circles instead of icons) is a
// stand-in.

import type { CSSProperties } from "react";

const JOURNEY_STEP_COUNT = 8; // keep in sync with JourneyStepper's STEPS

function Bar({
  width = "100%",
  height = 11,
  radius = 6,
  light = false,
  style,
}: {
  width?: string | number;
  height?: number;
  radius?: number;
  light?: boolean;
  style?: CSSProperties;
}) {
  return <div className={light ? "skel skel-light" : "skel"} style={{ width, height, borderRadius: radius, ...style }} />;
}

function SkeletonDetailCard({ lines = 2 }: { lines?: number }) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="card-head">
          <div className="card-title">
            <Bar width={30} height={30} radius={9} />
            <Bar width={130} height={14} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Array.from({ length: lines }).map((_, i) => (
            <Bar key={i} width={i === lines - 1 ? "55%" : "100%"} />
          ))}
        </div>
      </div>
      <div className="completed-bar pending" style={{ background: "transparent" }}>
        <Bar width={90} height={10} />
      </div>
    </div>
  );
}

function SkeletonSideCard({ lines = 2 }: { lines?: number }) {
  return (
    <div className="card">
      <div className="card-body">
        <Bar width={110} height={13} style={{ marginBottom: 14 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Array.from({ length: lines }).map((_, i) => (
            <Bar key={i} width={i === lines - 1 ? "60%" : "90%"} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SkeletonHero() {
  return (
    <div className="hero">
      <div className="hero-row">
        <Bar width={78} height={78} radius={999} light style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 180, display: "flex", flexDirection: "column", gap: 8 }}>
          <Bar width={160} height={18} light />
          <Bar width={120} height={11} light />
          <Bar width={200} height={11} light />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Bar width={76} height={76} radius={999} light style={{ flexShrink: 0 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Bar width={150} height={11} light />
            <Bar width={110} height={30} radius={10} light />
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonJourney() {
  return (
    <div className="journey">
      <div className="steps">
        {Array.from({ length: JOURNEY_STEP_COUNT }).map((_, i) => (
          <div key={i} className="step">
            <span className="circ">
              <span className="skel" style={{ width: 14, height: 14, borderRadius: 999 }} />
            </span>
            <Bar width={44} height={9} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading your dashboard">
      <SkeletonHero />
      <SkeletonJourney />

      <div className="grid">
        <div className="col">
          <SkeletonDetailCard lines={3} />
          <SkeletonDetailCard lines={2} />
          <SkeletonDetailCard lines={2} />
          <SkeletonDetailCard lines={2} />
          <SkeletonDetailCard lines={2} />
          <SkeletonDetailCard lines={1} />
          <SkeletonDetailCard lines={1} />
          <SkeletonDetailCard lines={1} />
          <SkeletonDetailCard lines={2} />
        </div>
        <div className="col">
          <SkeletonSideCard lines={2} />
          <SkeletonSideCard lines={3} />
          <SkeletonSideCard lines={2} />
          <SkeletonSideCard lines={5} />
        </div>
      </div>
    </div>
  );
}
