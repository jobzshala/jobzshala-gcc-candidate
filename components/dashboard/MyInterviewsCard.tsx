"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarIcon } from "@/components/ui/icons";
import { getMyInterviews, type MyInterview } from "@/lib/api/interviews";
import { ROUTES } from "@/lib/routes";

const formatWhen = (value: string | null, timezone: string): string => {
  if (!value) return "Time to be confirmed";
  try {
    return new Date(value).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: timezone,
    });
  } catch {
    return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  }
};

const STATUS_LABEL: Partial<Record<MyInterview["status"], string>> = {
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  SELECTED: "Selected",
  SECOND_ROUND_REQUIRED: "Second round scheduled",
};

// "Confirmed or later" only — the backend never sends a bare REQUESTED a
// candidate hasn't been told about yet (INTERVIEWS-FLOW-PLAN.md §4 v3 table).
export default function MyInterviewsCard() {
  const [interviews, setInterviews] = useState<MyInterview[] | null>(null);

  useEffect(() => {
    getMyInterviews()
      .then(setInterviews)
      .catch(() => setInterviews([]));
  }, []);

  if (interviews === null) {
    return (
      <div className="card">
        <div className="card-body">
          <h3 style={{ fontSize: 13.5 }}>Your Interviews</h3>
        </div>
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <div className="card">
        <div className="card-body">
          <h3 style={{ fontSize: 13.5 }}>Your Interviews</h3>
          <p style={{ marginTop: 12, fontSize: 12.5, color: "var(--ink-faint)" }}>
            No interviews scheduled yet — when an employer requests one, it&apos;ll appear here once a recruiter confirms it.
          </p>
        </div>
      </div>
    );
  }

  // Nearest upcoming CONFIRMED interview first, else whatever's most recent.
  const next =
    [...interviews]
      .filter((i) => i.status === "CONFIRMED" && i.scheduled_at)
      .sort((a, b) => new Date(a.scheduled_at!).getTime() - new Date(b.scheduled_at!).getTime())[0] ?? interviews[0];

  return (
    <div className="card">
      <div className="card-body">
        <div className="card-head">
          <h3 style={{ fontSize: 13.5 }}>Your Interviews</h3>
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 10 }}>
          <span className="rav" style={{ flexShrink: 0 }}>
            <CalendarIcon className="icon" />
          </span>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 12.5, fontWeight: 600 }}>{next.job.title}</p>
            <p style={{ fontSize: 11.5, color: "var(--ink-faint)" }}>{next.employer.company_name}</p>
            <p style={{ fontSize: 11.5, marginTop: 4 }}>{formatWhen(next.scheduled_at, next.timezone)}</p>
            <p style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 2 }}>
              {STATUS_LABEL[next.status] ?? next.status.replace(/_/g, " ")}
            </p>
          </div>
        </div>

        {next.meeting_link && next.status === "CONFIRMED" ? (
          <a href={next.meeting_link} target="_blank" rel="noopener noreferrer" className="btn-block" style={{ display: "block", textAlign: "center" }}>
            Join interview
          </a>
        ) : (
          <Link href={ROUTES.interviews} className="btn-block" style={{ display: "block", textAlign: "center" }}>
            View details
          </Link>
        )}

        {interviews.length > 1 && (
          <Link href={ROUTES.interviews} style={{ display: "block", marginTop: 10, fontSize: 11.5, textAlign: "center", color: "var(--ink-faint)" }}>
            View all {interviews.length} interviews
          </Link>
        )}
      </div>
    </div>
  );
}
