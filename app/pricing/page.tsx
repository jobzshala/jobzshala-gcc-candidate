import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingPlans from "@/components/PricingPlans";
import SectionHeading from "@/components/ui/SectionHeading";
import { getPublicSubscriptionPlans } from "@/lib/api/subscription-plans";

export const metadata: Metadata = {
  title: "Pricing | Jobzshala",
};

export default async function PricingPage() {
  const plans = await getPublicSubscriptionPlans().catch(() => []);

  return (
    <div className="flex flex-1 flex-col bg-jz-blue-950">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <SectionHeading
            align="center"
            heading="Simple pricing for"
            highlight="candidates and employers"
            subheading="Choose the plan that fits where you are — whether you're hiring across the GCC or looking for your next opportunity."
            className="mx-auto max-w-2xl"
          />

          <div className="mt-10">
            <PricingPlans plans={plans} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
