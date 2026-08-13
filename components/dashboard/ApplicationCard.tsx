"use client";

import { useState } from "react";
import { STAGES, stagePercent, type JobApplication } from "./jobApplicationsData";

export function StageTrack({ stageIndex, rejectedAt }: { stageIndex: number; rejectedAt?: number }) {
  const total = STAGES.length;
  const trackStart = stagePercent(0, total);

  const segments =
    rejectedAt === undefined
      ? [{ left: trackStart, width: stagePercent(stageIndex, total) - trackStart, kind: "done" as const }]
      : [
          ...(rejectedAt > 0
            ? [{ left: trackStart, width: stagePercent(rejectedAt - 1, total) - trackStart, kind: "done" as const }]
            : []),
          {
            left: rejectedAt > 0 ? stagePercent(rejectedAt - 1, total) : trackStart,
            width: stagePercent(rejectedAt, total) - (rejectedAt > 0 ? stagePercent(rejectedAt - 1, total) : trackStart),
            kind: "rejected" as const,
          },
        ];

  return (
    <div className="mtrack">
      {segments.map((seg, i) => (
        <div
          key={i}
          className={`fill${seg.kind === "rejected" ? " rejected" : ""}`}
          style={{ left: `${seg.left}%`, width: `${seg.width}%` }}
        />
      ))}
      {STAGES.map((label, i) => {
        const done = rejectedAt === undefined ? i < stageIndex : i < rejectedAt;
        const current = rejectedAt === undefined && i === stageIndex;
        const stopped = rejectedAt === i;
        const reached = done || current || stopped;
        return (
          <div key={label} className={`mnode${done ? " done" : ""}${current ? " current" : ""}${stopped ? " stopped" : ""}`}>
            <span className="c">{stopped ? "✕" : done ? "✓" : current ? "●" : "○"}</span>
            <span className="l" style={reached ? undefined : { color: "var(--ink-faint)" }}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function ApplicationCard({ app, defaultOpen }: { app: JobApplication; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`jcard${app.statusKind === "closed" ? " rejected" : ""}`}>
      <div className="jcard-head">
        <div className="jcard-title">
          <h4>{app.title}</h4>
          <div className="meta">
            <span>{app.employer}</span>
            <span>·</span>
            <span>{app.location}</span>
            <span>·</span>
            <span className="sal">{app.salary}</span>
          </div>
        </div>
        <span className={`jbadge jbadge-${app.statusKind}`}>{app.statusLabel}</span>
      </div>

      <StageTrack stageIndex={app.stageIndex} rejectedAt={app.rejectedAt} />

      {open && (
        <div className="tl">
          {app.timeline.map((entry, i) => {
            const reachedIndex = app.rejectedAt !== undefined ? app.rejectedAt : app.stageIndex;
            const state = i < reachedIndex ? "done" : i === reachedIndex ? "current" : "pending";
            return (
              <div key={entry.label} className={`tl-row ${state}`}>
                <span className="dot" />
                <div className="body">
                  <div className="head">
                    <h5>{entry.label}</h5>
                    <span className="when">{entry.when}</span>
                  </div>
                  <p>{entry.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="jcard-foot">
        <button type="button" className="toggle" onClick={() => setOpen((v) => !v)}>
          {open ? "▾ Hide timeline" : "▸ Show full timeline"}
        </button>
        <div className="actions">
          <button type="button" className="btn-outline" disabled title="Coming soon">
            {app.actionLabel}
          </button>
          {app.primaryAction && (
            <button type="button" className="btn-solid" disabled title="Coming soon">
              {app.primaryAction}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
