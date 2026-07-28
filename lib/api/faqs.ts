const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v3";

// FAQs are admin-managed content (v1), not a v3-candidate-scoped resource —
// strip this app's version segment and call v1 directly instead of routing
// through apiFetch's v3-scoped base (same reasoning as success-stories.ts /
// blog-posts.ts / subscription-plans.ts).
const API_ROOT_URL = API_BASE_URL.replace(/\/v\d+$/, "");

export type FaqCategory =
  | "GENERAL"
  | "RECRUITMENT_SOLUTIONS"
  | "WORKFORCE_INFRASTRUCTURE"
  | "AI_MATCHING"
  | "CANDIDATE_VERIFICATION"
  | "VISA_ASSISTANCE";

export interface Faq {
  id: number;
  category: FaqCategory;
  question: string;
  answer: string;
  display_order: number;
}

interface ApiEnvelope<T> {
  status: boolean;
  message?: string;
  result?: T;
}

export async function getPublicFaqs(params?: { category?: FaqCategory; page?: number; limit?: number }): Promise<Faq[]> {
  const query = new URLSearchParams();
  if (params?.category) query.set("category", params.category);
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));

  const response = await fetch(`${API_ROOT_URL}/v1/faqs/public?${query.toString()}`, {
    next: { revalidate: 300 },
  });

  const data = (await response.json().catch(() => null)) as ApiEnvelope<Faq[]> | null;

  if (!response.ok || !data?.status) {
    throw new Error(data?.message || "Unable to load FAQs.");
  }

  return data.result ?? [];
}
