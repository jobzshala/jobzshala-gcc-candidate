"use client";

import { useState } from "react";

// Static preview of a feature that doesn't exist in the API yet — there's no
// "show interest" action or per-job application status today (match_scores /
// candidate_match_reveals only gate paywall visibility, they don't record
// intent). This section is deliberately labelled "Preview · sample data" so
// it can never be mistaken for a real candidate's actual applications; swap
// this whole component out once GET /candidate/applications is real.
const STAGES = ["Interested", "Recruiter Review", "Interview", "Offer"] as const;

interface TimelineEntry {
  label: string;
  when: string;
  description: string;
}

interface JobApplication {
  id: string;
  title: string;
  employer: string;
  location: string;
  salary: string;
  /** Index into STAGES the application has reached (0-3). */
  stageIndex: number;
  /** Set only when the application closed without reaching the next stage. */
  rejectedAt?: number;
  statusLabel: string;
  statusKind: "progress" | "action" | "closed";
  timeline: TimelineEntry[];
  actionLabel: string;
  primaryAction?: string;
}

const SAMPLE_APPLICATIONS: JobApplication[] = [
  {
    id: "warehouse-supervisor",
    title: "Warehouse Supervisor",
    employer: "Al Noor Logistics",
    location: "Dubai, UAE",
    salary: "AED 3,200/mo",
    stageIndex: 2,
    statusLabel: "Interview stage",
    statusKind: "progress",
    timeline: [
      { label: "You showed interest", when: "2 Aug 2026", description: "Saved from your Job Matches list." },
      {
        label: "Recruiter reviewed your profile",
        when: "4 Aug 2026",
        description: "Your recruiter matched your experience against the role and moved you forward.",
      },
      {
        label: "Interview scheduled",
        when: "9 Aug 2026 · 2:00 PM IST",
        description: "Video call with the hiring manager. Link will be shared 24 hours before.",
      },
      { label: "Offer", when: "—", description: "Waiting on your interview outcome." },
    ],
    actionLabel: "View job details",
  },
  {
    id: "electrician",
    title: "Electrician",
    employer: "Gulf Bay Construction",
    location: "Doha, Qatar",
    salary: "QAR 2,800/mo",
    stageIndex: 1,
    statusLabel: "Recruiter review",
    statusKind: "progress",
    timeline: [
      { label: "You showed interest", when: "6 Aug 2026", description: "Saved from your Job Matches list." },
      {
        label: "Recruiter review in progress",
        when: "In progress",
        description: "Your recruiter is checking this role against your profile.",
      },
      { label: "Interview", when: "—", description: "Not yet reached." },
      { label: "Offer", when: "—", description: "Not yet reached." },
    ],
    actionLabel: "View job details",
  },
  {
    id: "delivery-executive",
    title: "Delivery Executive",
    employer: "Falcon Retail Group",
    location: "Abu Dhabi, UAE",
    salary: "AED 2,600/mo",
    stageIndex: 3,
    statusLabel: "Offer received",
    statusKind: "action",
    timeline: [
      { label: "You showed interest", when: "1 Aug 2026", description: "Saved from your Job Matches list." },
      { label: "Recruiter reviewed your profile", when: "3 Aug 2026", description: "Moved forward to interview." },
      { label: "Interview completed", when: "5 Aug 2026", description: "You cleared the interview round." },
      {
        label: "Offer sent",
        when: "7 Aug 2026",
        description: "Falcon Retail Group sent an offer. Review the details and respond.",
      },
    ],
    actionLabel: "Decline",
    primaryAction: "Review offer",
  },
  {
    id: "security-guard",
    title: "Site Security Guard",
    employer: "Desert Rose Facilities",
    location: "Manama, Bahrain",
    salary: "BHD 180/mo",
    stageIndex: 2,
    rejectedAt: 2,
    statusLabel: "Not selected",
    statusKind: "closed",
    timeline: [
      { label: "You showed interest", when: "30 Jul 2026", description: "Saved from your Job Matches list." },
      { label: "Recruiter reviewed your profile", when: "1 Aug 2026", description: "Moved forward to interview." },
      {
        label: "Not selected after interview",
        when: "5 Aug 2026",
        description: "Keep applying — more matches are waiting for you.",
      },
      { label: "Offer", when: "—", description: "Not reached." },
    ],
    actionLabel: "Browse similar jobs",
  },
];

// Center of stage i out of `total`, as a percent of the track's full width —
// matches how the track line and node column are laid out below, so the
// fill's left/width always land exactly on the node centers it's connecting
// rather than being eyeballed per card (that's what overflowed past the
// track edge in the original design mockup at 100% width).
function stagePercent(index: number, total: number): number {
  return ((index + 0.5) / total) * 100;
}

function StageTrack({ stageIndex, rejectedAt }: { stageIndex: number; rejectedAt?: number }) {
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

function ApplicationCard({ app, defaultOpen }: { app: JobApplication; defaultOpen: boolean }) {
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

export default function JobApplicationsPreview() {
  return (
    <div className="card">
      <div className="card-body">
        <div className="card-head">
          <h3 style={{ fontSize: 14.5 }}>Your Job Applications</h3>
          <span className="jbadge jbadge-preview">Preview · sample data</span>
        </div>
        <p style={{ fontSize: 11.5, color: "var(--ink-faint)", marginTop: -8, marginBottom: 16 }}>
          Once you can show interest in a job, each one will track its own stage here — shown with example
          applications until that&apos;s live.
        </p>

        <div className="jlist">
          {SAMPLE_APPLICATIONS.map((app, i) => (
            <ApplicationCard key={app.id} app={app} defaultOpen={i === 0} />
          ))}
        </div>

        <div className="postoffer">
          <h4>After you accept an offer</h4>
          <p className="note">
            Visa and deployment won&apos;t be tracked per job — a candidate is only ever visa-processing or deploying
            against one accepted offer, so accepting will replace that job&apos;s card above with a single combined
            tracker instead.
          </p>
          <div className="potrack">
            <div className="fill" style={{ width: "50%" }} />
            <div className="mnode done" style={{ gridColumn: 1 }}>
              <span className="c">{"✓"}</span>
              <span className="l">Visa</span>
            </div>
            <div className="mnode" style={{ gridColumn: 2 }}>
              <span className="c">{"○"}</span>
              <span className="l">Deployment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
