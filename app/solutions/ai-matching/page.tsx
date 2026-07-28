import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CtaCards from "@/components/CtaCards";
import JsonLd from "@/components/JsonLd";
import SectionHeading from "@/components/ui/SectionHeading";
import Accordion, { type AccordionItem } from "@/components/ui/Accordion";
import MatchVisual from "@/components/ui/MatchVisual";
import {
  ArrowRightIcon,
  DocumentIcon,
  GlobeIcon,
  GridIcon,
  SparkleIcon,
  ShieldCheckIcon,
  TickIcon,
  VideoIcon,
} from "@/components/ui/icons";
import { getPublicFaqs } from "@/lib/api/faqs";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "AI Matching",
  description:
    "AI-powered candidate-to-job matching for GCC employers — verified, job-ready workforce instead of a pile of resumes to sort through.",
  path: "/solutions/ai-matching",
});

const FLOW = [
  { title: "Profile Submitted", icon: DocumentIcon },
  { title: "AI Scores the Fit", icon: SparkleIcon },
  { title: "Recruiter Confirms Match", icon: TickIcon },
];

const FEATURES: AccordionItem[] = [
  {
    question: "AI Candidate Matching",
    leading: <SparkleIcon className="size-5 shrink-0 text-jz-yellow-400" />,
    answer: "Requirements are matched against verified profiles automatically, ranking candidates by fit instead of leaving you to sort resumes.",
  },
  {
    question: "Recruiter-Verified Profiles",
    leading: <ShieldCheckIcon className="size-5 shrink-0" />,
    answer: "Every match is checked by a human recruiter before it reaches your dashboard, so a high score also means a real, ready candidate.",
  },
  {
    question: "Video Resume Screening",
    leading: <VideoIcon className="size-5 shrink-0 text-jz-yellow-400" />,
    answer: "See and hear candidates before the interview stage, saving time on early-stage screening calls.",
  },
  {
    question: "Real-Time Hiring Dashboard",
    leading: <GridIcon className="size-5 shrink-0 text-jz-yellow-400" />,
    answer: "Track every requirement, shortlist and offer status in one place, updated live as recruiters and candidates act on it.",
  },
  {
    question: "Cross-Border Hiring Support",
    leading: <GlobeIcon className="size-5 shrink-0 text-jz-yellow-400" />,
    answer: "Matching accounts for visa eligibility and relocation readiness, not just skills — so shortlists are deployment-ready.",
  },
  {
    question: "Deployment Tracking",
    leading: <TickIcon className="size-5 shrink-0" />,
    answer: "Follow a candidate from offer through travel to joining, without chasing updates manually.",
  },
];

export default async function AiMatchingPage() {
  const faqs = await getPublicFaqs({ category: "AI_MATCHING" }).catch(() => []);
  const faqItems: AccordionItem[] = faqs.map((faq) => ({ question: faq.question, answer: faq.answer }));

  return (
    <div className="flex flex-1 flex-col bg-jz-blue-950">
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
          { name: "AI Matching", path: "/solutions/ai-matching" },
        ])}
      />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <SectionHeading
            align="center"
            heading="AI-Powered"
            highlight="Candidate Matching"
            subheading="More than recruitment — workforce infrastructure that matches employers to job-ready workforce automatically."
            className="mx-auto max-w-2xl"
          />

          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
            {FLOW.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="flex items-center gap-2">
                  <div className="flex items-center gap-2 rounded-full border border-jz-grey-400 bg-jz-bg-primary py-2 pr-4 pl-2.5">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-jz-blue-400 to-jz-blue-800">
                      <Icon className="size-3.5 text-jz-white-50" />
                    </span>
                    <span className="text-sm font-medium text-jz-white-50">{step.title}</span>
                  </div>
                  {i < FLOW.length - 1 && <ArrowRightIcon className="size-4 shrink-0 text-jz-yellow-400" />}
                </div>
              );
            })}
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 className="font-serif text-xl font-semibold text-jz-white-50">Why GCC Employers Choose Jobzshala</h2>
              <p className="mt-2 text-sm text-jz-white-400">Tap a feature to see what it actually does.</p>

              <Accordion items={FEATURES} defaultOpen={0} className="mt-6" />

              <blockquote className="mt-8 font-serif text-xl font-bold text-jz-yellow-500">
                &ldquo;We don&rsquo;t send thousands of resumes. We deliver verified, job-ready workforce&rdquo;
              </blockquote>
            </div>

            <MatchVisual className="aspect-[4/3] w-full lg:sticky lg:top-24" />
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
