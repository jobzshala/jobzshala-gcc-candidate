export type DashboardStatus = "verified" | "screening" | "shortlisted" | "pending";

export type DashboardRow = {
  name: string;
  status: DashboardStatus;
  statusLabel: string;
  /** Highlights this row as the one currently in motion. */
  active?: boolean;
};

const STATUS_CLASSES: Record<DashboardStatus, string> = {
  verified: "bg-jz-green-500/15 text-jz-green-500",
  screening: "bg-jz-yellow-400/15 text-jz-yellow-400",
  shortlisted: "bg-jz-blue-400/15 text-jz-blue-400",
  pending: "bg-jz-white-600/15 text-jz-white-600",
};

/**
 * Mock of the actual employer dashboard — a small window chrome, a few
 * tracked rows, and a progress bar — used in place of a stock photo wherever
 * a page's pitch is "every stage tracked in one place" (Recruitment
 * Solutions, Visa Assistance). Rows/labels are passed in so the same visual
 * language can be re-themed per page without duplicating markup.
 */
export default function StageDashboard({
  windowTitle,
  rows,
  progressLabel,
  progressPercent,
  className = "",
}: {
  windowTitle: string;
  rows: DashboardRow[];
  progressLabel: string;
  progressPercent: number;
  className?: string;
}) {
  return (
    <div className={`flex h-full flex-col overflow-hidden rounded-2xl border border-jz-grey-400 bg-jz-bg-primary ${className}`}>
      <div className="flex items-center gap-1.5 border-b border-jz-grey-400 bg-jz-blue-900 px-4 py-2.5">
        <span className="size-2 rounded-full bg-jz-grey-400" />
        <span className="size-2 rounded-full bg-jz-grey-400" />
        <span className="size-2 rounded-full bg-jz-grey-400" />
        <span className="ml-1.5 font-mono text-[11px] text-jz-white-400">{windowTitle}</span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-col gap-2">
          {rows.map((row) => (
            <div
              key={row.name}
              className={`flex items-center justify-between rounded-lg border border-transparent bg-jz-blue-950 px-3 py-2.5 ${
                row.active ? "animate-dash-glow border-jz-blue-400" : ""
              }`}
            >
              <span className="text-[13px] text-jz-white-50">{row.name}</span>
              <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${STATUS_CLASSES[row.status]}`}>
                {row.statusLabel}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-auto border-t border-jz-grey-400 pt-3.5">
          <p className="text-[11.5px] text-jz-white-400">
            {progressLabel} <b className="font-mono font-bold text-jz-yellow-400">{progressPercent}%</b>
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-jz-grey-400">
            <div
              className="h-full rounded-full bg-gradient-to-r from-jz-blue-400 to-jz-yellow-400"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
