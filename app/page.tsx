import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WorkforceChallenge from "@/components/WorkforceChallenge";
import HowItWorks from "@/components/HowItWorks";
import OurSolution from "@/components/OurSolution";
import VerifiedTrusted from "@/components/VerifiedTrusted";
import WorkforceOperations from "@/components/WorkforceOperations";
import AiHumanRecruitment from "@/components/AiHumanRecruitment";
import WorkforceCorridor from "@/components/WorkforceCorridor";
import BuiltForEmployers from "@/components/BuiltForEmployers";
import BuiltForWorkforce from "@/components/BuiltForWorkforce";
import OurVision from "@/components/OurVision";
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
    <div className="flex flex-1 flex-col bg-[#F6F9FA] font-poppins">
      {/* Describes the actual offering, so search and AI answer engines can
          state what Jobzshala does and where, rather than inferring it. */}
      <JsonLd schema={serviceSchema()} />
      <HashScrollFix />
      <Header />
      <main className="flex-1">
        <Hero />
        <WorkforceChallenge />
        <OurSolution />
        <HowItWorks />
        <VerifiedTrusted />
        <WorkforceOperations />
        <AiHumanRecruitment />
        <WorkforceCorridor />
        <BuiltForEmployers />
        <BuiltForWorkforce />
        <OurVision />
      </main>
      <Footer />
    </div>
  );
}
