import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CtaCards from "@/components/CtaCards";
import JsonLd from "@/components/JsonLd";
import SectionHeading from "@/components/ui/SectionHeading";
import Timeline, { type TimelineStep } from "@/components/ui/Timeline";
import Accordion, { type AccordionItem } from "@/components/ui/Accordion";
import StageDashboard, { type DashboardRow } from "@/components/ui/StageDashboard";
import { ArrowRightIcon, DocumentIcon, GlobeIcon, ShieldCheckIcon, TargetIcon, TickIcon, UserIcon } from "@/components/ui/icons";
import { getPublicFaqs } from "@/lib/api/faqs";
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

const DASHBOARD_ROWS: DashboardRow[] = [
  { name: "Offer Accepted", status: "verified", statusLabel: "Done" },
  { name: "Documentation Collected", status: "verified", statusLabel: "Done" },
  { name: "Medical Fitness Check", status: "screening", statusLabel: "In Progress", active: true },
  { name: "Visa Processing", status: "pending", statusLabel: "Pending" },
];

export default async function VisaAssistancePage() {
  const faqs = await getPublicFaqs({ category: "VISA_ASSISTANCE" }).catch(() => []);
  const faqItems: AccordionItem[] = faqs.map((faq) => ({ question: faq.question, answer: faq.answer }));

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
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <SectionHeading
            align="center"
            heading="Visa &"
            highlight="Deployment Assistance"
            subheading="Visa, medical, travel and joining operations — handled end-to-end so verified candidates reach their GCC employer ready to work."
            className="mx-auto max-w-2xl"
          />

          <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:items-stretch">
            <div>
              <h2 className="font-serif text-xl font-semibold text-jz-white-50 sm:text-2xl">From offer to first day</h2>
              <p className="mt-2 text-sm text-jz-white-400">Tap a stage to see what it involves.</p>
              <div className="mt-6">
                <Timeline steps={JOURNEY} />
              </div>
              <p className="text-xs text-jz-white-600 italic">
                Exact steps and document requirements can vary by country and role — your recruiter will confirm specifics for your
                case.
              </p>
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <StageDashboard
                windowTitle="visa file · candidate #4821"
                rows={DASHBOARD_ROWS}
                progressLabel="Visa progress"
                progressPercent={42}
              />
              <p className="mt-4 text-sm leading-relaxed text-jz-white-400">
                Every visa stage on the left moves through this same tracked pipeline — visible to both employer and
                candidate, no separate emails or spreadsheets.
              </p>
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

          <div className="mx-auto mt-10 flex max-w-3xl items-center gap-4 rounded-2xl border border-jz-grey-400 bg-gradient-to-r from-jz-bg-primary to-jz-blue-900 p-6">
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
