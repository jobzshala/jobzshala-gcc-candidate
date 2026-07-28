import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import JsonLd from "@/components/JsonLd";
import { getPublicBlogPosts } from "@/lib/api/blog-posts";
import { PUBLIC_ROUTES, breadcrumbSchema, pageMetadata } from "@/lib/seo";

// Human-readable counterpart to /sitemap.xml. Both read PUBLIC_ROUTES from
// lib/seo.ts, so the crawler sitemap and this page can't drift apart.
export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Sitemap",
  description:
    "Every public page on Jobzshala — platform pages, pricing, success stories, blog articles and legal policies — in one index.",
  path: "/sitemap",
});

function LinkList({ links }: { links: { path: string; label: string }[] }) {
  return (
    <ul className="mt-4 flex flex-col gap-2.5">
      {links.map((link) => (
        <li key={link.path}>
          <Link
            href={link.path}
            className="text-sm text-jz-white-200 underline-offset-4 transition-colors hover:text-jz-yellow-400 hover:underline"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-jz-grey-400 bg-jz-bg-primary p-6">
      <h2 className="font-serif text-lg font-semibold text-jz-white-50">{title}</h2>
      {children}
    </section>
  );
}

export default async function SitemapPage() {
  const posts = await getPublicBlogPosts({ limit: 200 }).catch(() => []);

  const platform = PUBLIC_ROUTES.filter((route) => route.group === "Platform");
  const solutions = PUBLIC_ROUTES.filter((route) => route.group === "Solutions");
  const legal = PUBLIC_ROUTES.filter((route) => route.group === "Legal");

  return (
    <div className="flex flex-1 flex-col bg-jz-blue-950">
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Sitemap", path: "/sitemap" },
        ])}
      />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <SectionHeading
            align="center"
            heading="Everything on"
            highlight="Jobzshala"
            subheading="A complete index of our public pages. Looking for the machine-readable version? See the XML sitemap."
            className="mx-auto max-w-2xl"
          />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Group title="Platform">
              <LinkList links={platform} />
            </Group>

            <Group title="Solutions">
              <LinkList links={solutions} />
            </Group>

            <Group title="Legal">
              <LinkList links={legal} />
            </Group>

            <Group title="Employers">
              <ul className="mt-4 flex flex-col gap-2.5">
                <li>
                  {/* Separate Next.js app served under /hire, so a plain anchor. */}
                  <a
                    href="/hire"
                    className="text-sm text-jz-white-200 underline-offset-4 transition-colors hover:text-jz-yellow-400 hover:underline"
                  >
                    Employer portal
                  </a>
                </li>
                <li>
                  <a
                    href="/hire/register"
                    className="text-sm text-jz-white-200 underline-offset-4 transition-colors hover:text-jz-yellow-400 hover:underline"
                  >
                    Register as an employer
                  </a>
                </li>
                <li>
                  <a
                    href="/hire/login"
                    className="text-sm text-jz-white-200 underline-offset-4 transition-colors hover:text-jz-yellow-400 hover:underline"
                  >
                    Employer login
                  </a>
                </li>
              </ul>
            </Group>

            {posts.length > 0 && (
              <div className="sm:col-span-2 lg:col-span-3">
                <Group title={`Blog (${posts.length})`}>
                  <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                      <li key={post.slug}>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-sm text-jz-white-200 underline-offset-4 transition-colors hover:text-jz-yellow-400 hover:underline"
                        >
                          {post.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Group>
              </div>
            )}
          </div>

          <p className="mt-10 text-center text-sm text-jz-white-400">
            <a href="/sitemap.xml" className="text-jz-yellow-400 underline-offset-4 hover:underline">
              XML sitemap
            </a>{" "}
            — for search engines and crawlers.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
