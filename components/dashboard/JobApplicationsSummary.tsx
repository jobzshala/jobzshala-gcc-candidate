import Link from "next/link";
import { AlertIcon } from "@/components/ui/icons";
import { ROUTES } from "@/lib/routes";
import { SAMPLE_APPLICATIONS } from "./jobApplicationsData";

// The condensed counterpart to the full /applications workspace — Journey
// only needs to answer "how many, and does anything need me right now,"
// not re-render every card with its full timeline (that duplicated the
// Applications page one-for-one, which is what "journey aur applications
// same lag raha hai" was about). The one application whose statusKind is
// "action" (an offer waiting on a response) surfaces as the highlighted
// card; everything else is a plain row.
export default function JobApplicationsSummary() {
  const urgent = SAMPLE_APPLICATIONS.find((app) => app.statusKind === "action");
  const rest = SAMPLE_APPLICATIONS.filter((app) => app.id !== urgent?.id);
  const activeCount = SAMPLE_APPLICATIONS.filter((app) => app.statusKind !== "closed").length;

  return (
    <div className="card">
      <div className="card-body">
        <div className="card-head">
          <h3>Your Job Applications</h3>
          <span className="jbadge jbadge-preview">Preview · sample data</span>
        </div>
        <p className="card-note">
          <strong style={{ color: "var(--ink)" }}>{activeCount} active applications</strong>
          {urgent && (
            <>
              {" · "}
              <strong style={{ color: "var(--amber)" }}>1 needs your attention</strong>
            </>
          )}
        </p>

        {urgent && (
          <div className="urgent-jcard">
            <div className="urgent-badge">
              <AlertIcon className="icon" />
              Needs your response
            </div>
            <div className="jcard-head" style={{ marginTop: 8 }}>
              <div className="jcard-title">
                <h4>{urgent.title}</h4>
                <div className="meta">
                  <span>{urgent.employer}</span>
                  <span>·</span>
                  <span>{urgent.location}</span>
                  <span>·</span>
                  <span className="sal">{urgent.salary}</span>
                </div>
              </div>
              <span className={`jbadge jbadge-${urgent.statusKind}`}>{urgent.statusLabel}</span>
            </div>
            <div className="urgent-actions">
              <button type="button" className="btn-outline" disabled title="Coming soon">
                {urgent.actionLabel}
              </button>
              {urgent.primaryAction && (
                <button type="button" className="btn-solid" disabled title="Coming soon">
                  {urgent.primaryAction}
                </button>
              )}
            </div>
          </div>
        )}

        <div className="jrow-list">
          {rest.map((app) => (
            <div key={app.id} className="jrow">
              <div className="jrow-main">
                <span className="jrow-title" style={app.statusKind === "closed" ? { color: "var(--ink-soft)" } : undefined}>
                  {app.title}
                </span>
                <span className="jrow-meta">
                  {app.employer} · {app.location}
                </span>
              </div>
              <span className={`jbadge jbadge-${app.statusKind}`}>{app.statusLabel}</span>
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
