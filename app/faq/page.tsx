import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CtaCards from "@/components/CtaCards";
import JsonLd from "@/components/JsonLd";
import SectionHeading from "@/components/ui/SectionHeading";
import Accordion, { type AccordionItem } from "@/components/ui/Accordion";
import { getPublicFaqs } from "@/lib/api/faqs";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "FAQs",
  description:
    "Common questions about creating an account, logging in, subscriptions and support — for candidates and employers on Jobzshala.",
  path: "/faq",
});

export default async function FaqPage() {
  const faqs = await getPublicFaqs({ category: "GENERAL" }).catch(() => []);
  const faqItems: AccordionItem[] = faqs.map((faq) => ({ question: faq.question, answer: faq.answer }));

  return (
    <div className="flex flex-1 flex-col bg-jz-blue-950">
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "FAQs", path: "/faq" },
        ])}
      />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-[800px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <SectionHeading
            align="center"
            heading="Frequently Asked"
            highlight="Questions"
            subheading="Common questions about accounts, logging in and subscriptions — for candidates and employers on Jobzshala."
            className="mx-auto max-w-2xl"
          />

          <div className="mt-12">
            {faqItems.length > 0 ? (
              <Accordion items={faqItems} defaultOpen={0} />
            ) : (
              <p className="text-center text-sm text-jz-white-400">No FAQs available right now — check back soon.</p>
            )}
          </div>

          <p className="mt-8 text-center text-sm text-jz-white-400">
            Looking for solution-specific questions?{" "}
            <Link href="/solutions" className="text-jz-yellow-400 hover:underline">
              Browse our Solutions pages
            </Link>{" "}
            or{" "}
            <a href="mailto:support@jobzshala.com" className="text-jz-yellow-400 hover:underline">
              contact support
            </a>
            .
          </p>
        </div>
      </main>
      <CtaCards />
      <Footer />
    </div>
  );
}
