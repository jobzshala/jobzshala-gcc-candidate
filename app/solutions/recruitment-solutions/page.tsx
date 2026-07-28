import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CtaCards from "@/components/CtaCards";
import JsonLd from "@/components/JsonLd";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Timeline, { type TimelineStep } from "@/components/ui/Timeline";
import Accordion, { type AccordionItem } from "@/components/ui/Accordion";
import StageDashboard, { type DashboardRow } from "@/components/ui/StageDashboard";
import { BriefcaseIcon, CheckIcon, CrossIcon, DocumentIcon, GlobeIcon, SearchIcon, SparkleIcon, TargetIcon, TickIcon, UserIcon } from "@/components/ui/icons";
import { getPublicFaqs } from "@/lib/api/faqs";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Recruitment Solutions",
  description:
    "AI-assisted sourcing and end-to-end recruitment for GCC employers — from raising a requirement to workforce deployment, managed on one platform.",
  path: "/solutions/recruitment-solutions",
});

const STATS = [
  { value: "7", label: "Managed Stages, One Platform" },
  { value: "500+", label: "Enterprise Hiring Requirements" },
  { value: "98%", label: "Deployment Success Rate" },
];

const STEPS: TimelineStep[] = [
  {
    title: "Employer Raises Requirement",
    icon: <BriefcaseIcon className="size-4.5" />,
    detail:
      "Share the role, headcount and location on the employer dashboard — Jobzshala's recruiters and AI matching engine start working the moment a requirement is raised.",
  },
  {
    title: "AI Matching Engine Identifies Suitable Workforce",
    icon: <SparkleIcon className="size-4.5" />,
    detail:
      "Verified candidate profiles are scored and ranked against your requirement in real time, surfacing the closest fits first instead of a flat resume database.",
  },
  {
    title: "Recruiter Screening & Profile Verification",
    icon: <SearchIcon className="size-4.5" />,
    detail:
      "A human recruiter reviews every shortlisted profile — checking documents, experience and readiness — before it ever reaches your dashboard.",
  },
  {
    title: "Employer Shortlisting & Interviews",
    icon: <TargetIcon className="size-4.5" />,
    detail: "Review verified profiles on your dashboard and move straight to interviews with candidates who match your requirement.",
  },
  {
    title: "Offer Management & Documentation",
    icon: <DocumentIcon className="size-4.5" />,
    detail: "Offers, acceptances and documentation are tracked on the platform, so nothing gets lost between employer, recruiter and candidate.",
  },
  {
    title: "Visa, Travel & Workforce Deployment",
    icon: <GlobeIcon className="size-4.5" />,
    detail: "Once an offer is accepted, Jobzshala coordinates visa processing and travel so candidates move from offer to on-site smoothly.",
  },
  {
    title: "Joining Support & Post-Deployment Tracking",
    icon: <TickIcon className="size-4.5" />,
    detail: "Support continues after joining, with shared visibility into deployment status for both employer and candidate.",
  },
];

const TRADITIONAL = ["Resume database", "Manual hiring", "Fragmented", "Agent-dependent"];
const JOBZSHALA = ["AI + Human Recruiters", "Verified Workforce", "Deployment", "Analytics — one integrated platform"];

const DASHBOARD_ROWS: DashboardRow[] = [
  { name: "Arun K.", status: "verified", statusLabel: "Verified" },
  { name: "Farhan S.", status: "screening", statusLabel: "Screening", active: true },
  { name: "Priya M.", status: "shortlisted", statusLabel: "Shortlisted" },
];

export default async function RecruitmentSolutionsPage() {
  const faqs = await getPublicFaqs({ category: "RECRUITMENT_SOLUTIONS" }).catch(() => []);
  const faqItems: AccordionItem[] = faqs.map((faq) => ({ question: faq.question, answer: faq.answer }));

  return (
    <div className="flex flex-1 flex-col bg-jz-blue-950">
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
          { name: "Recruitment Solutions", path: "/solutions/recruitment-solutions" },
        ])}
      />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <SectionHeading
            align="center"
            heading="Recruitment Solutions for"
            highlight="GCC Employers"
            subheading="AI-assisted sourcing and end-to-end hiring — from raising a requirement to workforce deployment, managed on one platform."
            className="mx-auto max-w-2xl"
          />

          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-3 sm:gap-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-jz-grey-400 bg-jz-bg-primary px-3 py-5 text-center sm:px-4">
                <p className="font-serif text-2xl font-bold text-jz-yellow-400 sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-[11px] leading-tight text-jz-white-400 sm:text-xs">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:items-stretch">
            <div>
              <h2 className="font-serif text-xl font-semibold text-jz-white-50 sm:text-2xl">Walk through the process</h2>
              <p className="mt-2 text-sm text-jz-white-400">Tap a stage to see what happens behind the scenes.</p>
              <div className="mt-6">
                <Timeline steps={STEPS} />
              </div>
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <StageDashboard
                windowTitle="requirement · WH-2291"
                rows={DASHBOARD_ROWS}
                progressLabel="Requirement progress"
                progressPercent={68}
              />
              <p className="mt-4 text-sm leading-relaxed text-jz-white-400">
                Every stage on the left is tracked here — so you always know exactly where a requirement stands, from the
                moment it&rsquo;s raised to the day workforce joins on-site.
              </p>
            </div>
          </div>

          <h2 className="mt-16 text-center font-serif text-xl font-semibold text-jz-white-50 sm:text-2xl">
            Why this beats a resume database
          </h2>
          <div className="mx-auto mt-6 grid max-w-3xl gap-6 sm:grid-cols-[220px_1fr] sm:items-stretch">
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-jz-grey-400 bg-jz-bg-primary p-5">
              <div className="flex flex-col items-center gap-2.5 rounded-xl border border-jz-red-600/25 bg-jz-red-600/5 p-4 text-center">
                <div className="relative h-16 w-full">
                  <div className="absolute top-1.5 left-[calc(50%-32px)] h-14 w-11 -rotate-6 rounded border border-jz-grey-400 bg-jz-blue-900 opacity-60" />
                  <div className="absolute top-0 left-[calc(50%+2px)] h-14 w-11 rotate-6 rounded border border-jz-grey-400 bg-jz-blue-900 opacity-80" />
                  <div className="absolute top-1 left-[calc(50%-22px)] h-14 w-11 -rotate-2 rounded border border-jz-grey-400 bg-jz-blue-900" />
                </div>
                <p className="text-xs leading-snug text-jz-white-300">
                  Hundreds of resumes.
                  <br />
                  No way to tell who&rsquo;s ready.
                </p>
              </div>

              <div className="relative flex items-center justify-center">
                <span className="absolute inset-x-0 top-1/2 h-px bg-jz-grey-400" />
                <span className="relative rounded-full border border-jz-grey-400 bg-jz-bg-primary px-3 py-1 font-serif text-[11px] font-bold tracking-wide text-jz-white-600">
                  VS
                </span>
              </div>

              <div className="flex flex-col items-center gap-2.5 rounded-xl border border-jz-blue-400/30 bg-jz-blue-400/10 p-4 text-center">
                <div className="flex w-full items-center gap-2.5 rounded-lg border border-jz-blue-400 bg-jz-blue-400/10 px-3 py-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-jz-blue-800 text-jz-white-50">
                    <UserIcon className="size-4" />
                  </span>
                  <div className="min-w-0 text-left">
                    <p className="text-xs font-semibold whitespace-nowrap text-jz-white-50">Verified Profile</p>
                    <p className="flex items-center gap-1 text-[10.5px] whitespace-nowrap text-jz-green-500">
                      <CheckIcon className="size-2.5" /> Deployment-ready
                    </p>
                  </div>
                </div>
                <p className="text-xs leading-snug text-jz-white-200">
                  One recruiter-checked match,
                  <br />
                  ready to interview.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-jz-grey-400">
              <div className="grid grid-cols-2">
                <div className="border-r border-jz-grey-400 bg-jz-bg-primary px-4 py-3 sm:px-6">
                  <p className="font-serif text-sm font-bold text-jz-white-50 sm:text-base">Traditional Agencies</p>
                </div>
                <div className="bg-jz-bg-primary px-4 py-3 sm:px-6">
                  <p className="font-serif text-sm font-bold text-jz-yellow-500 sm:text-base">Jobzshala</p>
                </div>
              </div>
              {TRADITIONAL.map((item, i) => (
                <div key={item} className="grid grid-cols-2 border-t border-jz-grey-400">
                  <div className="flex items-center gap-2.5 border-r border-jz-grey-400 px-4 py-3.5 text-sm text-jz-white-300 sm:px-6">
                    <CrossIcon className="size-4.5 shrink-0" />
                    {item}
                  </div>
                  <div className="flex items-center gap-2.5 bg-jz-yellow-500/5 px-4 py-3.5 text-sm font-medium text-jz-white-50 sm:px-6">
                    <TickIcon className="size-4.5 shrink-0" />
                    {JOBZSHALA[i]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {faqItems.length > 0 && (
            <>
              <h2 className="mt-16 text-center font-serif text-xl font-semibold text-jz-white-50 sm:text-2xl">Common questions</h2>
              <div className="mx-auto mt-6 max-w-3xl">
                <Accordion items={faqItems} defaultOpen={-1} />
              </div>
            </>
          )}

          <div className="mt-10 flex justify-center">
            <Button variant="primary" href="/hire/login">
              Request Workforce
            </Button>
          </div>
        </div>
      </main>
      <CtaCards />
      <Footer />
    </div>
  );
}
