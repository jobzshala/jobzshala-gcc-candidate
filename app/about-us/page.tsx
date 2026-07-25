import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import CtaCards from "@/components/CtaCards";
import SectionHeading from "@/components/ui/SectionHeading";
import { breadcrumbSchema, pageMetadata, SITE_DESCRIPTION } from "@/lib/seo";
import AboutContent from "./AboutContent";

export const metadata: Metadata = pageMetadata({
  title: "About Us",
  description: SITE_DESCRIPTION,
  path: "/about-us",
});

export default function AboutUsPage() {
  return (
    <div className="flex flex-1 flex-col bg-jz-blue-950">
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About Us", path: "/about-us" },
        ])}
      />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <SectionHeading
            align="center"
            heading="About"
            highlight="Jobzshala"
            subheading="AI-native workforce infrastructure connecting verified talent with employers across the GCC."
            className="mx-auto max-w-2xl"
          />

          <div className="mt-10">
            <AboutContent />
          </div>
        </div>

        <CtaCards />
      </main>
      <Footer />
    </div>
  );
}
