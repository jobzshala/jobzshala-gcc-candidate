import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import { getPublicBlogPosts } from "@/lib/api/blog-posts";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description:
    "Writing on GCC hiring, workforce mobility from India to the Gulf, candidate verification, visa and deployment compliance, and how AI is changing blue-collar recruitment.",
  path: "/blog",
});

function formatDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

export default async function BlogPage() {
  const posts = await getPublicBlogPosts({ limit: 30 }).catch(() => []);

  return (
    <div className="flex flex-1 flex-col bg-jz-blue-950">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <SectionHeading
            align="center"
            heading="Insights for"
            highlight="candidates and employers"
            subheading="Career advice, hiring playbooks, and news from across the GCC job market."
            className="mx-auto max-w-2xl"
          />

          {posts.length === 0 ? (
            <p className="mt-14 text-center text-sm text-jz-white-400">More posts are coming soon.</p>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-jz-grey-400 bg-jz-bg-primary transition-colors hover:border-jz-yellow-400/60"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-jz-blue-900">
                    {post.cover_image ? (
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-jz-white-600">
                        Jobzshala
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-2.5 p-6">
                    <span className="w-fit rounded-full bg-jz-blue-900 px-2.5 py-1 text-xs font-medium text-jz-yellow-400">
                      {post.category.name}
                    </span>
                    <h3 className="font-serif text-lg font-semibold text-jz-white-50">{post.title}</h3>
                    {post.excerpt && <p className="line-clamp-2 text-sm text-jz-white-400">{post.excerpt}</p>}

                    <div className="mt-auto flex items-center gap-2 pt-3 text-xs text-jz-white-600">
                      {post.author_name && <span>{post.author_name}</span>}
                      {post.author_name && formatDate(post.published_at) && <span aria-hidden="true">·</span>}
                      {formatDate(post.published_at) && <span>{formatDate(post.published_at)}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
