const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v3";

// Success stories are admin-managed content (v1), not a v3-candidate-scoped
// resource — strip this app's version segment and call v1 directly instead
// of routing through apiFetch's v3-scoped base (same reasoning as
// subscription-plans.ts / blog-posts.ts).
const API_ROOT_URL = API_BASE_URL.replace(/\/v\d+$/, "");

export interface SuccessStory {
  id: number;
  candidate_name: string;
  slug: string;
  designation: string | null;
  company_name: string | null;
  location: string | null;
  quote: string;
  content: string | null;
  photo: string | null;
  published_at: string | null;
}

interface ApiEnvelope<T> {
  status: boolean;
  message?: string;
  result?: T;
}

export async function getPublicSuccessStories(params?: { page?: number; limit?: number }): Promise<SuccessStory[]> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));

  const response = await fetch(`${API_ROOT_URL}/v1/success-stories/public?${query.toString()}`, {
    next: { revalidate: 300 },
  });

  const data = (await response.json().catch(() => null)) as ApiEnvelope<SuccessStory[]> | null;

  if (!response.ok || !data?.status) {
    throw new Error(data?.message || "Unable to load success stories.");
  }

  return data.result ?? [];
}
