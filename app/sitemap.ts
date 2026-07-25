import type { MetadataRoute } from "next";
import { getPublicBlogPosts } from "@/lib/api/blog-posts";
import { IS_CANONICAL_HOST, PUBLIC_ROUTES, absoluteUrl } from "@/lib/seo";

// Revalidated rather than built once, so posts published from the admin panel
// appear in the sitemap without a redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Only the production hosts advertise a sitemap — any other host serves an
  // empty one so preview deployments don't submit their URLs.
  if (!IS_CANONICAL_HOST) return [];

  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = PUBLIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // A sitemap must never fail the build (or the route) just because the API is
  // unreachable — fall back to the static routes alone.
  const posts = await getPublicBlogPosts({ limit: 200 }).catch(() => []);

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: post.published_at ? new Date(post.published_at) : now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...postEntries];
}
