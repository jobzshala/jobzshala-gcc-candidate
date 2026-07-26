const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v3";

// System status is admin-managed infrastructure data (v1), not a v3-candidate
// -scoped resource — strip this app's version segment and call v1 directly
// (same reasoning as blog-posts.ts / subscription-plans.ts).
const API_ROOT_URL = API_BASE_URL.replace(/\/v\d+$/, "");

export type DayStatus = "operational" | "degraded" | "outage" | "unknown";
export type OverallStatus = DayStatus;

export interface ServiceDay {
  date: string;
  status: DayStatus;
}

export interface ServiceStatus {
  service: string;
  label: string;
  description: string;
  currentStatus: DayStatus;
  uptimePercent: number | null;
  avgResponseTimeMs: number | null;
  days: ServiceDay[];
}

export interface SystemStatus {
  generatedAt: string;
  overallStatus: OverallStatus;
  avgResponseTimeMs: number | null;
  openIncidents: number;
  incidentsInWindow: number;
  services: ServiceStatus[];
}

interface ApiEnvelope<T> {
  status: boolean;
  message?: string;
  result?: T;
}

export async function getSystemStatus(days: 30 | 90 = 90): Promise<SystemStatus> {
  const response = await fetch(`${API_ROOT_URL}/v1/system-status/public?days=${days}`, {
    next: { revalidate: 60 },
  });

  const data = (await response.json().catch(() => null)) as ApiEnvelope<SystemStatus> | null;

  if (!response.ok || !data?.status || !data.result) {
    throw new Error(data?.message || "Unable to load system status.");
  }

  return data.result;
}
