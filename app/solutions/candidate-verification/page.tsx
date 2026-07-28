import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CtaCards from "@/components/CtaCards";
import JsonLd from "@/components/JsonLd";
import SectionHeading from "@/components/ui/SectionHeading";
import Timeline, { type TimelineStep } from "@/components/ui/Timeline";
import Accordion, { type AccordionItem } from "@/components/ui/Accordion";
import { CheckIcon, DocumentIcon, ShieldCheckIcon, TargetIcon, TickIcon, UserIcon } from "@/components/ui/icons";
import { getPublicFaqs } from "@/lib/api/faqs";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Candidate Verification",
  description:
    "Every Jobzshala candidate is recruiter-verified, document-validated, skill-assessed and interview-ready before an employer ever sees the profile.",
  path: "/solutions/candidate-verification",
});

const STEPS: TimelineStep[] = [
  {
    title: "Application Received",
    icon: <DocumentIcon className="size-4.5" />,
    detail: "A candidate creates a GCC Workforce Profile and submits identity and experience details.",
  },
  {
    title: "Document Validation",
    icon: <ShieldCheckIcon className="size-4.5" />,
    detail: "Identity, experience and qualification documents are checked against the profile — not just uploaded and accepted at face value.",
  },
  {
    title: "Skill Assessment",
    icon: <TargetIcon className="size-4.5" />,
    detail: "Candidates are evaluated against the skills the role actually needs, not just self-reported experience.",
  },
  {
    title: "Recruiter Interview",
    icon: <UserIcon className="size-4.5" />,
    detail: "A recruiter speaks with the candidate directly to confirm readiness and intent before the profile is listed.",
  },
  {
    title: "Verified & Listed",
    icon: <TickIcon className="size-4.5" />,
    detail: "The profile is marked Verified and becomes visible to employers whose requirements match.",
  },
];

const BADGES = ["Recruiter-Verified", "Document-Validated", "Skill-Assessed", "Interview-Ready"];

export default async function CandidateVerificationPage() {
  const faqs = await getPublicFaqs({ category: "CANDIDATE_VERIFICATION" }).catch(() => []);
  const faqItems: AccordionItem[] = faqs.map((faq) => ({ question: faq.question, answer: faq.answer }));

  return (
    <div className="flex flex-1 flex-col bg-jz-blue-950">
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
          { name: "Candidate Verification", path: "/solutions/candidate-verification" },
        ])}
      />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <SectionHeading
            align="center"
            heading="Candidate"
            highlight="Verification"
            subheading="Employers deserve verified workforce. Candidates deserve genuine opportunities."
            className="mx-auto max-w-2xl"
          />

          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_300px] lg:items-start">
            <div>
              <h2 className="font-serif text-xl font-semibold text-jz-white-50">The verification pipeline</h2>
              <p className="mt-2 text-sm text-jz-white-400">Tap a stage to see what it checks for.</p>
              <div className="mt-6">
                <Timeline steps={STEPS} />
              </div>
            </div>

            {/* Illustrative UI preview of the badges an employer sees on a verified profile — not a real document or certificate. */}
            <div className="rounded-2xl border border-jz-grey-400 bg-gradient-to-b from-jz-bg-primary to-jz-blue-900 p-5 lg:sticky lg:top-24">
              <p className="text-xs font-medium tracking-wide text-jz-white-600 uppercase">What employers see</p>
              <div className="mt-3 flex items-center gap-3 border-b border-jz-grey-400 pb-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-jz-blue-800 text-jz-white-50">
                  <UserIcon className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-jz-white-50">Candidate Profile</p>
                  <p className="flex items-center gap-1 text-xs text-jz-green-500">
                    <ShieldCheckIcon className="size-3.5" /> Verified
                  </p>
                </div>
              </div>
              <ul className="mt-4 flex flex-col gap-2.5">
                {BADGES.map((badge) => (
                  <li key={badge} className="flex items-center gap-2 text-sm text-jz-white-200">
                    <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-jz-green-500/15 text-jz-green-500">
                      <CheckIcon className="size-2.5" />
                    </span>
                    {badge}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse items-center gap-8 rounded-2xl border border-jz-grey-400 bg-gradient-to-r from-jz-bg-primary to-jz-blue-900 p-8 sm:p-10 lg:flex-row rtl:lg:flex-row-reverse">
            <div className="text-center lg:text-left rtl:lg:text-right">
              <h2 className="font-serif text-2xl font-semibold text-jz-white-50 sm:text-3xl">Trust &amp; Verification</h2>
              <p className="mt-4 max-w-3xl text-jz-white-200">
                Every candidate is{" "}
                <span className="font-semibold text-jz-white-50">
                  Recruiter-Verified · Document-Validated · Skill-Assessed · Interview-Ready
                </span>{" "}
                before an employer ever sees the profile.
              </p>
            </div>
            <div className="flex size-24 shrink-0 items-center justify-center rounded-full bg-jz-green-500/10 lg:size-32">
              <ShieldCheckIcon className="size-14 lg:size-20" />
            </div>
          </div>

          {faqItems.length > 0 && (
            <>
              <h2 className="mt-10 font-serif text-xl font-semibold text-jz-white-50 sm:text-2xl">Common questions</h2>
              <div className="mt-6">
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
