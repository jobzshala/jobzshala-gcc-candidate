import { authFetch } from "./client";

// Mirrors src/modules/v3/interviews/interviews.service.ts's listMyInterviews
// on the backend — confirmed-or-later only (a candidate never sees a bare
// REQUESTED they haven't been told about), and never carries employer
// contact details, feedback, or outcome deliberations.
export type InterviewMode = "ONLINE" | "OFFLINE";
export type InterviewStatus =
  | "CONFIRMED"
  | "COMPLETED"
  | "SELECTED"
  | "REJECTED"
  | "HOLD"
  | "SECOND_ROUND_REQUIRED"
  | "CANCELLED"
  | "NO_SHOW";

export interface MyInterview {
  id: number;
  status: InterviewStatus;
  mode: InterviewMode;
  scheduled_at: string | null;
  timezone: string;
  instructions: string | null;
  meeting_link: string | null;
  platform: { name: string } | null;
  employer: { company_name: string };
  job: { title: string };
}

export function getMyInterviews(): Promise<MyInterview[]> {
  return authFetch<MyInterview[]>("/candidates/me/interviews");
}
