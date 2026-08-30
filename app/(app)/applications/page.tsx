"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ApplicationCard from "@/components/dashboard/ApplicationCard";
import { getMyInterests, type InterestStatus, type JobInterest } from "@/lib/api/jobs";
import { ROUTES } from "@/lib/routes";

type Filter = "all" | InterestStatus;

const CHIPS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "INTERESTED", label: "Interested" },
  { key: "NOT_INTERESTED", label: "Not interested" },
];

function ApplicationCardSkeleton() {
  return (
    <div className="jcard">
      <div className="jcard-head">
        <div className="jcard-title" style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0, flex: 1 }}>
          <div className="skel" style={{ width: "55%", height: 15 }} />
          <div className="skel" style={{ width: "75%", height: 11 }} />
        </div>
        <div className="skel" style={{ width: 78, height: 22, borderRadius: 999 }} />
      </div>
      <div className="skel" style={{ width: "50%", height: 11, marginTop: 10 }} />
    </div>
  );
}

// The full workspace counterpart to JobApplicationsSummary (the condensed
// widget on /journey) — every job you've shown interest in, filterable by
// status. Backed by GET /candidate/jobs/interest. Fetched once, unfiltered,
// then sliced client-side per chip — the candidate's own interest list is
// small, and this is what lets every chip show an accurate count without a
// round trip per filter change.
export default function ApplicationsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [interests, setInterests] = useState<JobInterest[] | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const page = await getMyInterests({ limit: 50 });
      setInterests(page.data);
    } catch {
      setError("We couldn't load your applications. Please try again.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const counts = useMemo(() => {
    const base = { all: interests?.length ?? 0, INTERESTED: 0, NOT_INTERESTED: 0 };
    for (const app of interests ?? []) base[app.status] += 1;
    return base;
  }, [interests]);

  const visible = useMemo(
    () => (filter === "all" ? interests : interests?.filter((app) => app.status === filter)),
    [interests, filter],
  );

  return (
    <div className="card">
      <div className="card-body">
        <div className="card-head">
          <h3>Your Job Applications</h3>
        </div>
        <p className="card-note">Every job you&apos;ve shown interest in, and where things stand.</p>

        <div className="filter-row">
          {CHIPS.map((chip) => (
            <button
              key={chip.key}
              type="button"
              className={`chip${filter === chip.key ? " active" : ""}`}
              onClick={() => setFilter(chip.key)}
            >
              {chip.label}
              {interests && <span className="count">{counts[chip.key]}</span>}
            </button>
          ))}
        </div>

        {error && (
          <div className="card" style={{ padding: 20, textAlign: "center", background: "var(--paper-soft)" }}>
            <p className="card-note" style={{ color: "var(--red, #e5484d)" }}>{error}</p>
            <button type="button" onClick={load} className="btn-outline" style={{ marginTop: 10 }}>
              Retry
            </button>
          </div>
        )}

        {interests === null && !error && (
          <div className="jlist" aria-busy="true" aria-label="Loading your applications">
            <ApplicationCardSkeleton />
            <ApplicationCardSkeleton />
            <ApplicationCardSkeleton />
          </div>
        )}

        {visible && visible.length === 0 && (
          <div className="card" style={{ padding: "28px 20px", textAlign: "center", background: "var(--paper-soft)" }}>
            <p className="card-note">
              {filter === "all"
                ? "No applications yet — express interest in a job to see it here."
                : "Nothing in this filter yet."}
            </p>
            {filter === "all" && (
              <Link href={ROUTES.matches} className="btn-solid" style={{ display: "inline-flex", marginTop: 12 }}>
                Browse Job Matches
              </Link>
            )}
          </div>
        )}

        {visible && visible.length > 0 && (
          <div className="jlist">
            {visible.map((app) => (
              <ApplicationCard key={app.id} app={app} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
