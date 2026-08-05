import { TargetIcon, EyeIcon, ChatIcon, ClipboardIcon } from "@/components/ui/icons";

// TODO(backend): none of jobs-matched / profile-views / interviews /
// applications are tracked anywhere in the API today (confirmed — no
// analytics or applications endpoints exist). Rows render with "—" rather
// than fabricated counts; wire each up once its backing endpoint exists.
const ROWS = [
  { icon: TargetIcon, label: "Jobs Matched" },
  { icon: EyeIcon, label: "Profile Views" },
  { icon: ChatIcon, label: "Interviews" },
  { icon: ClipboardIcon, label: "Applications" },
] as const;

export default function ActivityCard() {
  return (
    <div className="card">
      <div className="card-body">
        <div className="card-head">
          <h3 style={{ fontSize: 13.5 }}>Your Activity</h3>
        </div>
        {ROWS.map((row) => (
          <div key={row.label} className="activity-row">
            <span className="activity-ic">
              <row.icon className="icon" />
            </span>
            <span className="activity-label">{row.label}</span>
            <span className="activity-val" style={{ color: "var(--ink-faint)" }}>
              —
            </span>
          </div>
        ))}
        <p style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 10 }}>Activity tracking is coming soon.</p>
      </div>
    </div>
  );
}
