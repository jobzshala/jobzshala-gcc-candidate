"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { getMyInterests, type JobInterest } from "@/lib/api/jobs";
import { formatLocation } from "./jobApplicationsData";

const PREVIEW_COUNT = 4;

// The condensed counterpart to the full /applications workspace — Journey
// only needs "how many jobs have you shown interest in," not every card
// re-rendered here (that duplicated the Applications page one-for-one,
// which is what "journey aur applications same lag raha hai" was about).
export default function JobApplicationsSummary() {
  const [interests, setInterests] = useState<JobInterest[] | null>(null);

  useEffect(() => {
    getMyInterests({ status: "INTERESTED", limit: PREVIEW_COUNT })
      .then((page) => setInterests(page.data))
      .catch(() => setInterests([]));
  }, []);

  if (interests === null) {
    return (
      <div className="card">
        <div className="card-body">
          <h3>Your Job Applications</h3>
        </div>
      </div>
    );
  }

  if (interests.length === 0) {
    return (
      <div className="card">
        <div className="card-body">
          <h3>Your Job Applications</h3>
          <p className="card-note" style={{ marginTop: 8 }}>
            No applications yet — express interest in a job from Job Matches to see it here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="card-head">
          <h3>Your Job Applications</h3>
        </div>
        <p className="card-note">
          <strong style={{ color: "var(--ink)" }}>{interests.length} active application{interests.length === 1 ? "" : "s"}</strong>
        </p>

        <div className="jrow-list">
          {interests.map((app) => (
            <div key={app.id} className="jrow">
              <div className="jrow-main">
                <span className="jrow-title">{app.job.job_title.name}</span>
                <span className="jrow-meta">
                  {app.job.employer.company_name} · {formatLocation(app)}
                </span>
              </div>
              <span className="jbadge jbadge-progress">Interested</span>
            </div>
          ))}
        </div>

        <Link href={ROUTES.applications} className="view-all">
          View all applications
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
