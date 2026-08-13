"use client";

import { useMemo, useState } from "react";
import ApplicationCard from "@/components/dashboard/ApplicationCard";
import { SAMPLE_APPLICATIONS, STAGES, type JobApplication } from "@/components/dashboard/jobApplicationsData";

type Filter = "all" | "Recruiter Review" | "Interview" | "Offer" | "Not selected";

function stageOf(app: JobApplication): Filter {
  if (app.rejectedAt !== undefined) return "Not selected";
  return STAGES[app.stageIndex] as Filter;
}

// The full workspace counterpart to JobApplicationsSummary (the condensed
// widget on /journey) — every application, every timeline, filterable by
// stage. Splitting these two apart is what fixed "journey aur applications
// same lag raha hai": Journey answers "what needs me right now," this page
// is where you actually work the pipeline. Static sample data until
// GET /candidate/applications exists — see jobApplicationsData.ts.
export default function ApplicationsPage() {
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: SAMPLE_APPLICATIONS.length, "Recruiter Review": 0, Interview: 0, Offer: 0, "Not selected": 0 };
    SAMPLE_APPLICATIONS.forEach((app) => {
      const stage = stageOf(app);
      if (stage !== "all") c[stage] += 1;
    });
    return c;
  }, []);

  const filtered = filter === "all" ? SAMPLE_APPLICATIONS : SAMPLE_APPLICATIONS.filter((app) => stageOf(app) === filter);

  const chips: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "Recruiter Review", label: "Recruiter Review" },
    { key: "Interview", label: "Interview" },
    { key: "Offer", label: "Offer" },
    { key: "Not selected", label: "Not selected" },
  ];

  return (
    <div className="card">
      <div className="card-body">
        <div className="card-head">
          <h3>Your Job Applications</h3>
          <span className="jbadge jbadge-preview">Preview · sample data</span>
        </div>
        <p className="card-note">
          Once you can show interest in a job, each one will track its own stage here — shown with example applications
          until that&apos;s live.
        </p>

        <div className="filter-row">
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              className={`chip${filter === chip.key ? " active" : ""}`}
              onClick={() => setFilter(chip.key)}
            >
              {chip.label} <span className="count">{counts[chip.key]}</span>
            </button>
          ))}
        </div>

        <div className="jlist">
          {filtered.map((app, i) => (
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
