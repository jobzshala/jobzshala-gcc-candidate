import { authFetch, authFetchEnvelope, type ApiEnvelope } from "./client";
import type { EntitlementState } from "./subscription";

/**
 * Ranked job matches (`/api/v3/candidate/jobs/matches`), gated by subscription.
 *
 * Locked entries are stripped by the server, not hidden here: a locked row
 * arrives with `job: null` and carries no employer, title, salary or score at
 * all. There is nothing in the payload to reveal, which is the point — hiding
 * fields in the client would not be a paywall.
 */

export interface MatchJob {
  id: number;
  slug: string;
  job_type: string;
  salary_offered: number;
  vacancies: number;
  description: string | null;
  joining_timeline: string | null;
  accommodation_benefits: string | null;
  expiry_date: string | null;
  created_at: string;
  job_title: { id: number; name: string };
  country: { id: number; name: string } | null;
  city: { id: number; name: string } | null;
  currency: { id: number; code: string; symbol: string } | null;
  experience_required: { id: number; name: string } | null;
  visa_type: { id: number; name: string } | null;
  employer: { id: number; company_name: string; company_logo_url: string | null; slug: string };
  skills: { id: number; name: string }[];
}

export interface UnlockedMatch {
  rank: number;
  locked: false;
  revealed_tier: "FREE" | "SUBSCRIBED";
  score: number;
  reason: string | null;
  job: MatchJob;
}

export interface LockedMatch {
  rank: number;
  locked: true;
  score: null;
  reason: null;
  job: null;
}

export type Match = UnlockedMatch | LockedMatch;

export interface MatchAccess {
  free_allowance: number;
  unlocked_count: number;
  locked_count: number;
  // null once the candidate is subscribed. Otherwise it carries the copy the
  // CTA should show, computed server-side so the client does not reimplement
  // the entitlement rules and get them subtly wrong.
  paywall: { reason: "FREE_LIMIT" | "SUBSCRIPTION_EXPIRED"; message: string } | null;
}

export interface MatchesPage {
  matches: Match[];
  entitlement: {
    state: EntitlementState;
    plan_name: string | null;
    end_date: string | null;
    days_remaining: number | null;
  };
  access: MatchAccess;
  pagination: { page: number; limit: number; total: number; total_pages: number };
}

// entitlement, access and pagination arrive as siblings of `result`, so this
// reads the whole envelope rather than the unwrapped result.
type MatchesEnvelope = ApiEnvelope<Match[]> & Omit<MatchesPage, "matches">;

export async function getMatches(params: { page?: number; limit?: number } = {}): Promise<MatchesPage> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const suffix = query.toString() ? `?${query.toString()}` : "";

  const envelope = (await authFetchEnvelope<Match[]>(
    `/candidate/jobs/matches${suffix}`
  )) as MatchesEnvelope;

  return {
    matches: envelope.result ?? [],
    entitlement: envelope.entitlement,
    access: envelope.access,
    pagination: envelope.pagination,
  };
}

export const getMatch = (jobId: number) =>
  authFetch<UnlockedMatch>(`/candidate/jobs/matches/${jobId}`);
