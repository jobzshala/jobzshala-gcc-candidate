import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CtaCards from "@/components/CtaCards";
import JsonLd from "@/components/JsonLd";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Timeline, { type TimelineStep } from "@/components/ui/Timeline";
import { BriefcaseIcon, CrossIcon, DocumentIcon, GlobeIcon, SearchIcon, SparkleIcon, TargetIcon, TickIcon } from "@/components/ui/icons";
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

export default function RecruitmentSolutionsPage() {
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
        <div className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <SectionHeading
            align="center"
            heading="Recruitment Solutions for"
            highlight="GCC Employers"
            subheading="AI-assisted sourcing and end-to-end hiring — from raising a requirement to workforce deployment, managed on one platform."
            className="mx-auto max-w-2xl"
          />

          <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-jz-grey-400 bg-jz-bg-primary px-3 py-5 text-center sm:px-4">
                <p className="font-serif text-2xl font-bold text-jz-yellow-400 sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-[11px] leading-tight text-jz-white-400 sm:text-xs">{stat.label}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-14 font-serif text-xl font-semibold text-jz-white-50 sm:text-2xl">Walk through the process</h2>
          <p className="mt-2 text-sm text-jz-white-400">Tap a stage to see what happens behind the scenes.</p>
          <div className="mt-6">
            <Timeline steps={STEPS} />
          </div>

          <h2 className="mt-8 font-serif text-xl font-semibold text-jz-white-50 sm:text-2xl">Why this beats a resume database</h2>
          <div className="mt-6 overflow-hidden rounded-2xl border border-jz-grey-400">
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
