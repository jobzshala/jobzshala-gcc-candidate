import { authFetch, authFetchEnvelope, type ApiEnvelope } from "./client";

/**
 * Job interest — the one action a candidate can take on a job today
 * (`POST /candidate/jobs/:id/interest`), and the two ways to read it back
 * (`GET /candidate/jobs/interest` list, `GET /candidate/jobs/:job_id/interest`
 * detail). This is a binary INTERESTED/NOT_INTERESTED flag on a
 * `job_applications` row, not a multi-stage pipeline — there is no
 * "recruiter review"/"interview"/"offer" stage in this data yet, so the UI
 * built on top of it must not imply one.
 */

export type InterestStatus = "INTERESTED" | "NOT_INTERESTED";

export interface InterestJob {
  id: number;
  status: string;
  salary_offered: number | null;
  vacancies: number;
  created_at: string;
  job_title: { id: number; name: string };
  country: { id: number; name: string } | null;
  city: { id: number; name: string } | null;
  currency: { id: number; code: string } | null;
  employer: { id: number; company_name: string; company_logo_url: string | null };
}

export interface JobInterest {
  id: number;
  candidate_id: number;
  job_id: number;
  status: InterestStatus;
  applied_at: string;
  job: InterestJob;
}

export interface MarkInterestResult {
  id: number;
  candidate_id: number;
  job_id: number;
  status: InterestStatus;
  applied_at: string;
}

export function markJobInterest(jobId: number, interested: boolean): Promise<MarkInterestResult> {
  return authFetch<MarkInterestResult>(`/candidate/jobs/${jobId}/interest`, {
    method: "POST",
    body: JSON.stringify({ interested }),
  });
}

export interface ListInterestsParams {
  status?: InterestStatus;
  job_title_id?: number;
  page?: number;
  limit?: number;
}

export interface InterestsPage {
  data: JobInterest[];
  pagination: { page: number; limit: number; total: number; total_pages: number };
}

// pagination arrives as a sibling of `result`, not nested inside it — see
// jobs.controller.ts's listMyInterests.
type InterestsEnvelope = ApiEnvelope<JobInterest[]> & Pick<InterestsPage, "pagination">;

export async function getMyInterests(params: ListInterestsParams = {}): Promise<InterestsPage> {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.job_title_id) query.set("job_title_id", String(params.job_title_id));
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const suffix = query.toString() ? `?${query.toString()}` : "";
  const envelope = (await authFetchEnvelope<JobInterest[]>(`/candidate/jobs/interest${suffix}`)) as InterestsEnvelope;

  return { data: envelope.result ?? [], pagination: envelope.pagination };
}

export interface JobInterestDetail extends Omit<JobInterest, "job"> {
  job: InterestJob & {
    description: string | null;
    visa_type: { id: number; name: string } | null;
    language: { id: number; name: string } | null;
    experience_required: { id: number; name: string } | null;
    salary_range: { id: number; name: string; min_amount: number; max_amount: number } | null;
    skills: { skill: { id: number; name: string } }[];
  };
}

export function getJobInterestDetail(jobId: number): Promise<JobInterestDetail> {
  return authFetch<JobInterestDetail>(`/candidate/jobs/${jobId}/interest`);
}
