import { authFetch } from "./client";

export type SupportIssueType =
  | "SALARY"
  | "ACCOMMODATION"
  | "MEDICAL"
  | "FOOD"
  | "TRANSFER"
  | "COMPLAINT"
  | "EMERGENCY"
  | "OTHER";

export type SupportTicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface SupportTicket {
  id: number;
  candidate_id: number;
  issue_type: SupportIssueType;
  description: string;
  status: SupportTicketStatus;
  assigned_to_id: number | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export function createSupportTicket(payload: { issue_type: SupportIssueType; description: string }): Promise<SupportTicket> {
  return authFetch<SupportTicket>("/candidate/support/tickets", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getMySupportTickets(): Promise<SupportTicket[]> {
  return authFetch<SupportTicket[]>("/candidate/support/tickets");
}
