const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v3";

// The subscription plan catalog is shared master data (admin-managed, v1),
// not a v3-candidate-scoped resource — strip this app's version segment and
// call v1 directly instead of routing through apiFetch's v3-scoped base.
const API_ROOT_URL = API_BASE_URL.replace(/\/v\d+$/, "");

export type SubscriptionUserType = "EMPLOYER" | "CANDIDATE";
export type BillingCycle = "MONTHLY" | "QUARTERLY" | "HALF_YEARLY" | "YEARLY";

export interface SubscriptionPlan {
  id: number;
  name: string;
  user_type: SubscriptionUserType;
  price: string | number;
  currency: {
    id: number;
    code: string;
    symbol: string;
  } | null;
  billing_cycle: BillingCycle;
  unlimited_job_postings: boolean;
  job_posting_limit: number | null;
  hiring_credits: number;
  features: Record<string, unknown>;
}

interface ApiEnvelope<T> {
  status: boolean;
  message?: string;
  result?: T;
}

export async function getPublicSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const response = await fetch(`${API_ROOT_URL}/v1/master/subscription-plans/public`, {
    next: { revalidate: 300 },
  });

  const data = (await response.json().catch(() => null)) as ApiEnvelope<SubscriptionPlan[]> | null;

  if (!response.ok || !data?.status) {
    throw new Error(data?.message || "Unable to load subscription plans.");
  }

  return data.result ?? [];
}
