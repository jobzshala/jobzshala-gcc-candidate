// Live component status/uptime now comes from the backend's health-check
// worker (see lib/api/system-status.ts, jobzshala-gcc-backend's
// src/workers/health-check.worker.ts). Past-incident postmortems below are
// still hand-written — the worker records what happened, not why, so add an
// entry here when a real incident is resolved.

export type IncidentLogEntry = {
  time: string;
  label: string;
  text: string;
};

export type Incident = {
  month: string;
  title: string;
  date: string;
  component: string;
  severity: "Minor" | "Major";
  duration: string;
  log: IncidentLogEntry[];
};

// Empty until a real incident happens and someone writes it up — no
// fabricated postmortems on a page that now shows genuinely monitored data.
export const INCIDENTS: Incident[] = [];
