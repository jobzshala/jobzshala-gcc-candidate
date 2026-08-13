import { TargetIcon, EyeIcon, ChatIcon, ClipboardIcon } from "@/components/ui/icons";

// TODO(backend): profile-views / applications still aren't tracked anywhere
// in the API (no analytics or applications endpoints exist). Those two keep
// rendering "—" rather than a fabricated count; wire each up once its
// backing endpoint exists. Jobs Matched and Interviews are both real now —
// pagination.total from GET /candidate/jobs/matches and the length of
// GET /candidates/me/interviews, both passed down from the dashboard pages.
const ROWS = [
  { icon: TargetIcon, label: "Jobs Matched", key: "matched" as const },
  { icon: EyeIcon, label: "Profile Views", key: "views" as const },
  { icon: ChatIcon, label: "Interviews", key: "interviews" as const },
  { icon: ClipboardIcon, label: "Applications", key: "applications" as const },
];

interface ActivityCardProps {
  /** null while loading or if the matches call failed — renders "—", same as
   *  the still-untracked metrics, rather than a misleading 0. */
  matchesTotal: number | null;
  /** Same null-means-unknown convention as matchesTotal. */
  interviewsTotal: number | null;
}

export default function ActivityCard({ matchesTotal, interviewsTotal }: ActivityCardProps) {
  const valueFor = (key: (typeof ROWS)[number]["key"]): string => {
    if (key === "matched" && matchesTotal !== null) return String(matchesTotal);
    if (key === "interviews" && interviewsTotal !== null) return String(interviewsTotal);
    return "—";
  };

  const stillPending = ROWS.some((row) => row.key === "views" || row.key === "applications");

  return (
    <div className="card">
      <div className="card-body">
        <div className="card-head">
          <h3 style={{ fontSize: 13.5 }}>Your Activity</h3>
        </div>
        {ROWS.map((row) => {
          const value = valueFor(row.key);
          return (
            <div key={row.label} className="activity-row">
              <span className="activity-ic">
                <row.icon className="icon" />
              </span>
              <span className="activity-label">{row.label}</span>
              <span className="activity-val" style={value === "—" ? { color: "var(--ink-faint)" } : undefined}>
                {value}
              </span>
            </div>
          );
        })}
        {stillPending && (
          <p style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 10 }}>
            Profile views and applications tracking is coming soon.
          </p>
        )}
      </div>
    </div>
  );
}
