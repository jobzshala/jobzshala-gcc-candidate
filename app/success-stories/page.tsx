import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import { getPublicSuccessStories } from "@/lib/api/success-stories";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = pageMetadata({
  title: "Success Stories",
  description:
    "Real placement outcomes from Jobzshala — candidates verified, hired and deployed to employers across the UAE, Saudi Arabia, Qatar, Oman, Kuwait and Bahrain.",
  path: "/success-stories",
});

export default async function SuccessStoriesPage() {
  const stories = await getPublicSuccessStories({ limit: 30 }).catch(() => []);

  return (
    <div className="flex flex-1 flex-col bg-jz-blue-950">
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Success Stories", path: "/success-stories" },
        ])}
      />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <SectionHeading
            align="center"
            heading="Real people,"
            highlight="real placements"
            subheading="Candidates who found their next role across the GCC through Jobzshala."
            className="mx-auto max-w-2xl"
          />

          {stories.length === 0 ? (
            <p className="mt-14 text-center text-sm text-jz-white-400">Success stories are coming soon.</p>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="flex flex-col rounded-2xl border border-jz-grey-400 bg-jz-bg-primary p-6"
                >
                  <svg viewBox="0 0 32 24" className="size-7 text-jz-yellow-400" fill="currentColor" aria-hidden="true">
                    <path d="M0 24V14.4C0 9.6 1.28 5.973 3.84 3.52 6.4 1.173 9.813 0 14.08 0v5.76c-2.24 0-3.947.587-5.12 1.76-1.067 1.067-1.653 2.4-1.76 4h6.08V24H0Zm17.92 0V14.4c0-4.8 1.28-8.427 3.84-10.88C24.32 1.173 27.733 0 32 0v5.76c-2.24 0-3.947.587-5.12 1.76-1.067 1.067-1.653 2.4-1.76 4h6.08V24H17.92Z" />
                  </svg>

                  <p className="mt-4 flex-1 text-[15px] leading-relaxed text-jz-white-200">{story.quote}</p>

                  <div className="mt-6 flex items-center gap-3 border-t border-jz-grey-400 pt-5">
                    <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-jz-blue-900">
                      {story.photo ? (
                        <Image src={story.photo} alt={story.candidate_name} fill className="object-cover" sizes="44px" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-jz-white-400">
                          {story.candidate_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-serif text-sm font-semibold text-jz-white-50">{story.candidate_name}</p>
                      <p className="truncate text-xs text-jz-white-400">
                        {[story.designation, story.company_name].filter(Boolean).join(" · ") || story.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
