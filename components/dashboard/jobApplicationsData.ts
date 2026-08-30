import type { JobInterest } from "@/lib/api/jobs";

// Shared formatting for the job-interest data both JobApplicationsSummary
// (condensed widget, /journey) and the full /applications workspace render —
// GET /candidate/jobs/interest backs both now. The API only carries a binary
// INTERESTED/NOT_INTERESTED flag per job, not a multi-stage pipeline (no
// "recruiter review"/"interview"/"offer" stage exists yet), so neither
// component should imply one.
export function formatLocation(app: JobInterest): string {
  return [app.job.city?.name, app.job.country?.name].filter(Boolean).join(", ") || "Location not specified";
}

export function formatSalary(app: JobInterest): string {
  const { salary_offered, currency } = app.job;
  if (!salary_offered) return "Not disclosed";
  return `${currency?.code ?? ""} ${Number(salary_offered).toLocaleString()}`.trim();
}

export function formatAppliedDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
}
