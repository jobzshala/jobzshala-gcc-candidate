import type { JobInterest } from "@/lib/api/jobs";
import { formatAppliedDate, formatLocation, formatSalary } from "./jobApplicationsData";

// No stage timeline here — GET /candidate/jobs/interest only carries a
// binary INTERESTED/NOT_INTERESTED flag per job (job_applications.status),
// not a multi-stage pipeline. A recruiter following up happens off-platform
// today, so this card shows what's actually known: the job, when interest
// was recorded, and the current flag.
export default function ApplicationCard({ app }: { app: JobInterest }) {
  const interested = app.status === "INTERESTED";

  return (
    <div className={`jcard${interested ? "" : " rejected"}`}>
      <div className="jcard-head">
        <div className="jcard-title">
          <h4>{app.job.job_title.name}</h4>
          <div className="meta">
            <span>{app.job.employer.company_name}</span>
            <span>·</span>
            <span>{formatLocation(app)}</span>
            <span>·</span>
            <span className="sal">{formatSalary(app)}</span>
          </div>
        </div>
        <span className={`jbadge jbadge-${interested ? "progress" : "closed"}`}>
          {interested ? "Interested" : "Not interested"}
        </span>
      </div>

      <p className="card-note" style={{ marginTop: 10 }}>
        Marked {formatAppliedDate(app.applied_at)} · your recruiter will follow up here once they review it.
      </p>
    </div>
  );
}
