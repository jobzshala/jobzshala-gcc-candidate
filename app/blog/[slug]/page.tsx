import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getPublicBlogPostBySlug } from "@/lib/api/blog-posts";
import { articleSchema, breadcrumbSchema, pageMetadata } from "@/lib/seo";

function formatDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublicBlogPostBySlug(slug).catch(() => null);

  if (!post) {
    // Missing post renders notFound() below; keep it out of the index either way.
    return pageMetadata({
      title: "Blog",
      description: "Writing on GCC hiring, workforce mobility and compliance from Jobzshala.",
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }

  return pageMetadata({
    title: post.meta_title || post.title,
    description:
      post.meta_description ||
      post.excerpt ||
      `${post.title} — from the Jobzshala blog on GCC hiring and workforce mobility.`,
    path: `/blog/${post.slug}`,
    type: "article",
    image: post.cover_image ?? undefined,
    publishedTime: post.published_at ?? undefined,
    authors: post.author_name ? [post.author_name] : undefined,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublicBlogPostBySlug(slug).catch(() => null);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col bg-jz-blue-950">
      <JsonLd
        schema={[
          articleSchema({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            coverImage: post.cover_image,
            authorName: post.author_name,
            publishedAt: post.published_at,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <Header />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <Link href="/blog" className="text-sm text-jz-white-400 hover:text-jz-yellow-400">
            ← Back to blog
          </Link>

          <span className="mt-6 block w-fit rounded-full bg-jz-blue-900 px-2.5 py-1 text-xs font-medium text-jz-yellow-400">
            {post.category.name}
          </span>

          <h1 className="mt-4 font-serif text-3xl font-bold text-jz-white-50 sm:text-4xl">{post.title}</h1>

          <div className="mt-3 flex items-center gap-2 text-sm text-jz-white-400">
            {post.author_name && <span>{post.author_name}</span>}
            {post.author_name && formatDate(post.published_at) && <span aria-hidden="true">·</span>}
            {formatDate(post.published_at) && <span>{formatDate(post.published_at)}</span>}
          </div>

          {post.cover_image && (
            <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-jz-grey-400">
              <Image src={post.cover_image} alt={post.title} fill className="object-cover" sizes="(min-width: 1024px) 768px, 100vw" priority />
            </div>
          )}

          {/* No typography plugin in this app — style the admin-authored HTML
              body directly with child-element selectors instead. */}
          <div
            className="mt-8 space-y-4 text-[15px] leading-7 text-jz-white-200 [&_a]:text-jz-yellow-400 [&_a]:underline [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-jz-white-50 [&_h3]:mt-6 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-jz-white-50 [&_li]:ml-5 [&_ol]:list-decimal [&_strong]:text-jz-white-50 [&_ul]:list-disc"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
      <Footer />
    </div>
  );
}
