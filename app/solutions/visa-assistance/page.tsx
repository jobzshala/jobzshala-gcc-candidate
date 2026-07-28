import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CtaCards from "@/components/CtaCards";
import JsonLd from "@/components/JsonLd";
import SectionHeading from "@/components/ui/SectionHeading";
import Timeline, { type TimelineStep } from "@/components/ui/Timeline";
import Accordion, { type AccordionItem } from "@/components/ui/Accordion";
import { ArrowRightIcon, DocumentIcon, GlobeIcon, ShieldCheckIcon, TargetIcon, TickIcon, UserIcon } from "@/components/ui/icons";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Visa Assistance",
  description:
    "Visa, medical, travel and joining operations for GCC-bound candidates — handled end-to-end so verified workforce reaches their employer ready to work.",
  path: "/solutions/visa-assistance",
});

const JOURNEY: TimelineStep[] = [
  {
    title: "Offer Accepted",
    icon: <TickIcon className="size-4.5" />,
    detail: "Once a candidate accepts an offer, the visa and deployment process begins on the platform.",
  },
  {
    title: "Documentation Collected",
    icon: <DocumentIcon className="size-4.5" />,
    detail: "Passport, photographs and other standard documents are collected and checked for completeness.",
  },
  {
    title: "Medical Fitness Check",
    icon: <ShieldCheckIcon className="size-4.5" />,
    detail: "Candidates complete the medical checks required for GCC work visas before the visa is filed.",
  },
  {
    title: "Visa Processing",
    icon: <GlobeIcon className="size-4.5" />,
    detail: "Jobzshala coordinates with the employer through visa filing and approval, keeping both sides updated.",
  },
  {
    title: "Travel Coordination",
    icon: <TargetIcon className="size-4.5" />,
    detail: "Travel is arranged once the visa is stamped, timed against the employer's joining date.",
  },
  {
    title: "Joining & Settling In",
    icon: <UserIcon className="size-4.5" />,
    detail: "Support continues after arrival, through joining formalities and the first weeks on the job.",
  },
];

const FAQS: AccordionItem[] = [
  {
    question: "Who handles my visa paperwork?",
    answer: "Jobzshala coordinates the visa process with your employer once you accept an offer, so you're not navigating it alone.",
  },
  {
    question: "What documents do I typically need?",
    answer:
      "Most GCC work visas start with a valid passport, passport-size photographs and your educational or experience certificates — your recruiter will confirm the exact list for your role and country.",
  },
  {
    question: "Do I need a medical check?",
    answer: "Yes — a medical fitness check is a standard requirement for GCC work visas and is arranged as part of the process.",
  },
  {
    question: "What happens after I land?",
    answer: "Joining support continues after arrival, with visibility into onboarding until you're settled in the role.",
  },
];

export default function VisaAssistancePage() {
  return (
    <div className="flex flex-1 flex-col bg-jz-blue-950">
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
          { name: "Visa Assistance", path: "/solutions/visa-assistance" },
        ])}
      />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <SectionHeading
            align="center"
            heading="Visa &"
            highlight="Deployment Assistance"
            subheading="Visa, medical, travel and joining operations — handled end-to-end so verified candidates reach their GCC employer ready to work."
            className="mx-auto max-w-2xl"
          />

          <h2 className="mt-14 font-serif text-xl font-semibold text-jz-white-50 sm:text-2xl">From offer to first day</h2>
          <p className="mt-2 text-sm text-jz-white-400">Tap a stage to see what it involves.</p>
          <div className="mt-6">
            <Timeline steps={JOURNEY} />
          </div>
          <p className="text-xs text-jz-white-600 italic">
            Exact steps and document requirements can vary by country and role — your recruiter will confirm specifics for your case.
          </p>

          <h2 className="mt-10 font-serif text-xl font-semibold text-jz-white-50 sm:text-2xl">Common questions</h2>
          <div className="mt-6">
            <Accordion items={FAQS} defaultOpen={-1} />
          </div>

          <div className="mt-8 flex items-center gap-4 rounded-2xl border border-jz-grey-400 bg-gradient-to-r from-jz-bg-primary to-jz-blue-900 p-6">
            <DocumentIcon className="size-8 shrink-0 text-jz-yellow-400" />
            <div className="min-w-0">
              <h3 className="font-serif text-base font-semibold text-jz-white-50">New to GCC work visas?</h3>
              <p className="mt-1 text-sm text-jz-white-400">Read our guide for first-time job seekers on what to expect.</p>
            </div>
            <Link
              href="/blog/uae-work-visas-explained-a-simple-guide-for-first-time-job-seekers"
              className="ml-auto inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-jz-yellow-400 hover:underline"
            >
              Read the guide
              <ArrowRightIcon className="size-4 shrink-0" />
            </Link>
          </div>
        </div>
      </main>
      <CtaCards />
      <Footer />
    </div>
  );
}
