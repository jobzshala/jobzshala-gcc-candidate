import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CtaCards from "@/components/CtaCards";
import JsonLd from "@/components/JsonLd";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRightIcon, BriefcaseIcon, DocumentIcon, GlobeIcon, ShieldCheckIcon, SparkleIcon } from "@/components/ui/icons";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Solutions",
  description:
    "Jobzshala's workforce solutions for GCC employers — recruitment, workforce infrastructure, AI matching, candidate verification and visa assistance, all on one platform.",
  path: "/solutions",
});

const SOLUTIONS = [
  {
    title: "Recruitment Solutions",
    href: "/solutions/recruitment-solutions",
    description: "AI-assisted sourcing and end-to-end hiring, from requirement to deployment.",
    icon: BriefcaseIcon,
  },
  {
    title: "Workforce Infrastructure",
    href: "/solutions/workforce-infrastructure",
    description: "Structured India → GCC workforce mobility, built for scale.",
    icon: GlobeIcon,
  },
  {
    title: "AI Matching",
    href: "/solutions/ai-matching",
    description: "AI-powered candidate-to-job matching that skips the resume pile.",
    icon: SparkleIcon,
  },
  {
    title: "Candidate Verification",
    href: "/solutions/candidate-verification",
    description: "Recruiter-verified, document-checked profiles before an employer sees them.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Visa Assistance",
    href: "/solutions/visa-assistance",
    description: "Visa, medical, travel and joining operations, handled end-to-end.",
    icon: DocumentIcon,
  },
];

export default function SolutionsPage() {
  return (
    <div className="flex flex-1 flex-col bg-jz-blue-950">
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
        ])}
      />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <SectionHeading
            align="center"
            heading="Workforce solutions built for the"
            highlight="GCC"
            subheading="Everything an employer needs to source, verify, hire and deploy trusted blue-collar workforce across the Gulf — in one platform."
            className="mx-auto max-w-2xl"
          />

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SOLUTIONS.map((solution) => {
              const Icon = solution.icon;
              return (
                <Link
                  key={solution.href}
                  href={solution.href}
                  className="group flex flex-col gap-4 rounded-2xl border border-jz-grey-400 bg-jz-bg-primary p-6 transition-colors hover:border-jz-blue-400"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-jz-blue-800 text-jz-yellow-400">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h2 className="font-serif text-lg font-semibold text-jz-white-50">{solution.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-jz-white-400">{solution.description}</p>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-jz-yellow-400">
                    Learn more
                    <ArrowRightIcon className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <CtaCards />
      <Footer />
    </div>
  );
}
