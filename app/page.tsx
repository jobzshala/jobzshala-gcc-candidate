import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustedBy from "@/components/TrustedBy";
import WorkforceChallenge from "@/components/WorkforceChallenge";
import HowItWorks from "@/components/HowItWorks";
import OurSolution from "@/components/OurSolution";
import WhyChooseUs from "@/components/WhyChooseUs";
import VerifiedTrusted from "@/components/VerifiedTrusted";
import WorkforceOperations from "@/components/WorkforceOperations";
import WorkforceAvailability from "@/components/WorkforceAvailability";
import WorkforceCorridor from "@/components/WorkforceCorridor";
import ComparisonSection from "@/components/ComparisonSection";
import PlatformFeatures from "@/components/PlatformFeatures";
import IndustriesWePower from "@/components/IndustriesWePower";
import BuiltForAbuDhabi from "@/components/BuiltForAbuDhabi";
import OurVision from "@/components/OurVision";
import CtaCards from "@/components/CtaCards";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import HashScrollFix from "@/components/HashScrollFix";
import { SITE_DESCRIPTION, serviceSchema } from "@/lib/seo";

export const metadata = {
  // Title intentionally omitted so the root layout's default (which is already
  // the landing page's title) applies without the "%s | Jobzshala" template
  // doubling the brand name.
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-jz-blue-950 font-poppins">
      {/* Describes the actual offering, so search and AI answer engines can
          state what Jobzshala does and where, rather than inferring it. */}
      <JsonLd schema={serviceSchema()} />
      <HashScrollFix />
      <Header />
      <main className="flex-1">
        <Hero />
        {/* <TrustedBy /> */}
        <WorkforceChallenge />
        <OurSolution />
        <HowItWorks />
        {/* <WhyChooseUs /> */}
        <VerifiedTrusted />
        <WorkforceOperations />
        <WorkforceAvailability />
        <WorkforceCorridor />
        <ComparisonSection />
        <PlatformFeatures />
        <IndustriesWePower />
        <BuiltForAbuDhabi />
        <OurVision />
        <CtaCards />
      </main>
      <Footer />
    </div>
  );
}
