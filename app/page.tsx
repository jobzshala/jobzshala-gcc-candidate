import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustedBy from "@/components/TrustedBy";
import WorkforceChallenge from "@/components/WorkforceChallenge";
import HowItWorks from "@/components/HowItWorks";
import WhyChooseUs from "@/components/WhyChooseUs";
import TrustVerification from "@/components/TrustVerification";
import WorkforceAvailability from "@/components/WorkforceAvailability";
import WorkforceCorridor from "@/components/WorkforceCorridor";
import ComparisonSection from "@/components/ComparisonSection";
import PlatformFeatures from "@/components/PlatformFeatures";
import IndustriesWePower from "@/components/IndustriesWePower";
import BuiltForAbuDhabi from "@/components/BuiltForAbuDhabi";
import OurVision from "@/components/OurVision";
import CtaCards from "@/components/CtaCards";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-jz-blue-950">
      <Header />
      <main className="flex-1">
        <Hero />
        <TrustedBy />
        <WorkforceChallenge />
        <HowItWorks />
        <WhyChooseUs />
        <TrustVerification />
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
