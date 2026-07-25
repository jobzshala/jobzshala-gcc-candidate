const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v3";

// Blog posts are admin-managed content (v1), not a v3-candidate-scoped
// resource — strip this app's version segment and call v1 directly instead
// of routing through apiFetch's v3-scoped base (same reasoning as
// subscription-plans.ts).
const API_ROOT_URL = API_BASE_URL.replace(/\/v\d+$/, "");

export interface BlogPostCategory {
  id: number;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  category_id: number;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  author_name: string | null;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  category: BlogPostCategory;
}

interface ApiEnvelope<T> {
  status: boolean;
  message?: string;
  result?: T;
}

export async function getPublicBlogPosts(params?: { page?: number; limit?: number }): Promise<BlogPost[]> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));

  const response = await fetch(`${API_ROOT_URL}/v1/blog-posts/public?${query.toString()}`, {
    next: { revalidate: 300 },
  });

  const data = (await response.json().catch(() => null)) as ApiEnvelope<BlogPost[]> | null;

  if (!response.ok || !data?.status) {
    throw new Error(data?.message || "Unable to load blog posts.");
  }

  return data.result ?? [];
}

export async function getPublicBlogPostBySlug(slug: string): Promise<BlogPost> {
  const response = await fetch(`${API_ROOT_URL}/v1/blog-posts/public/${encodeURIComponent(slug)}`, {
    next: { revalidate: 300 },
  });

  const data = (await response.json().catch(() => null)) as ApiEnvelope<BlogPost> | null;

  if (!response.ok || !data?.status || !data.result) {
    throw new Error(data?.message || "Blog post not found.");
  }

  return data.result;
}
