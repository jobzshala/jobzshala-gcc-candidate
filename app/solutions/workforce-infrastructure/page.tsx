import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CtaCards from "@/components/CtaCards";
import JsonLd from "@/components/JsonLd";
import SectionHeading from "@/components/ui/SectionHeading";
import CorridorVisual from "@/components/ui/CorridorVisual";
import FlagIcon, { type GccCountryCode } from "@/components/ui/FlagIcon";
import Accordion, { type AccordionItem } from "@/components/ui/Accordion";
import { ArrowRightIcon, GlobeIcon, ShieldCheckIcon, TickIcon, UserIcon } from "@/components/ui/icons";
import { getPublicFaqs } from "@/lib/api/faqs";
import { breadcrumbSchema, GCC_COUNTRIES, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Workforce Infrastructure",
  description:
    "Structured, technology-enabled India → GCC workforce mobility — from profile verification through visa support to post-deployment tracking.",
  path: "/solutions/workforce-infrastructure",
});

const STATS = [
  { value: "50,000", label: "Workforce Profiles" },
  { value: "10,000+", label: "Verified Candidates" },
  { value: "6", label: "GCC Countries" },
  { value: "98%", label: "Deployment Success" },
];

// Index-matched to GCC_COUNTRIES.
const COUNTRY_CODES: GccCountryCode[] = ["AE", "SA", "QA", "OM", "KW", "BH"];

const PIPELINE = [
  { title: "Source Pool", subtitle: "India", icon: UserIcon, body: "A continuously growing base of verified blue-collar and technical workforce across India." },
  { title: "Verification Layer", subtitle: "Screening", icon: ShieldCheckIcon, body: "Every profile passes document validation and skill assessment before entering the active pool." },
  { title: "Deployment Corridor", subtitle: "Visa & Travel", icon: GlobeIcon, body: "Visa, travel and joining operations move candidates from India into the GCC in a structured, tracked process." },
  { title: "In-Region Support", subtitle: "Post-Deployment", icon: TickIcon, body: "Once deployed, candidates and employers stay visible on the platform through onboarding and beyond." },
];

export default async function WorkforceInfrastructurePage() {
  const faqs = await getPublicFaqs({ category: "WORKFORCE_INFRASTRUCTURE" }).catch(() => []);
  const faqItems: AccordionItem[] = faqs.map((faq) => ({ question: faq.question, answer: faq.answer }));

  return (
    <div className="flex flex-1 flex-col bg-jz-blue-950">
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
          { name: "Workforce Infrastructure", path: "/solutions/workforce-infrastructure" },
        ])}
      />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <SectionHeading
            align="center"
            heading="India to GCC Workforce"
            highlight="Corridor"
            subheading="Structured, technology-enabled workforce mobility — built for employers who need reliable pipelines, not one-off placements."
            className="mx-auto max-w-2xl"
          />

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-jz-grey-400 bg-jz-bg-primary px-3 py-5 text-center">
                <p className="font-serif text-2xl font-bold text-jz-yellow-400 sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-[11px] leading-tight text-jz-white-400 sm:text-xs">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-jz-white-50 sm:text-3xl">Building Trusted Workforce Mobility</h2>
              <p className="mt-4 max-w-xl text-jz-white-200">
                Jobzshala connects verified workforce from India with GCC employers through a structured, technology-enabled
                deployment process — from profile verification through visa support to post-deployment support.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {GCC_COUNTRIES.map((country, i) => (
                  <div
                    key={country}
                    className="group flex items-center gap-2 rounded-xl border border-jz-grey-400 bg-jz-bg-primary px-3 py-2.5 transition-colors hover:border-jz-blue-400"
                  >
                    <FlagIcon code={COUNTRY_CODES[i]} title={country} />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-jz-white-50">{country}</p>
                      <p className="text-[10px] text-jz-green-500 group-hover:text-jz-yellow-400">Active Deployment</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <CorridorVisual className="aspect-square w-full max-w-md justify-self-center lg:max-w-none" />
          </div>

          <h2 className="mt-16 font-serif text-xl font-semibold text-jz-white-50 sm:text-2xl">The infrastructure behind the corridor</h2>
          <div className="mt-6 flex snap-x items-stretch gap-2 overflow-x-auto pb-4 lg:overflow-visible">
            {PIPELINE.map((stage, i) => {
              const Icon = stage.icon;
              return (
                <div key={stage.title} className="flex min-w-0 shrink-0 items-stretch gap-2 lg:flex-1">
                  <div className="flex w-56 min-w-0 shrink-0 snap-start flex-col gap-2 rounded-2xl border border-jz-grey-400 bg-gradient-to-t from-jz-bg-primary to-jz-blue-900 p-5 transition-colors hover:border-jz-blue-400 lg:w-auto">
                    <Icon className="size-8 shrink-0 text-jz-blue-400" />
                    <p className="mt-1 text-sm font-semibold text-jz-white-50">{stage.title}</p>
                    <p className="font-mono text-[10px] tracking-wide text-jz-yellow-400 uppercase">{stage.subtitle}</p>
                    <p className="mt-1 text-xs leading-relaxed text-jz-white-400">{stage.body}</p>
                  </div>
                  {i < PIPELINE.length - 1 && <ArrowRightIcon className="size-5 shrink-0 self-center text-jz-yellow-400 max-lg:hidden" />}
                </div>
              );
            })}
          </div>

          <div className="mt-10 rounded-2xl border border-jz-grey-400 bg-gradient-to-r from-jz-bg-primary to-jz-blue-900 p-8 text-center sm:p-10">
            <h3 className="font-serif text-xl font-semibold text-jz-white-50 sm:text-2xl">Need Immediate Joiners?</h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-jz-white-200 sm:text-base">
              Access recruiter-verified candidates already inside UAE, Saudi Arabia, Qatar, Oman, Kuwait and Bahrain — reduce
              hiring turnaround time with workforce already in-region.
            </p>
          </div>

          {faqItems.length > 0 && (
            <>
              <h2 className="mt-16 font-serif text-xl font-semibold text-jz-white-50 sm:text-2xl">Common questions</h2>
              <div className="mt-6 max-w-3xl">
                <Accordion items={faqItems} defaultOpen={-1} />
              </div>
            </>
          )}
        </div>
      </main>
      <CtaCards />
      <Footer />
    </div>
  );
}
