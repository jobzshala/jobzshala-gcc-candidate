import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingPlans from "@/components/PricingPlans";
import SectionHeading from "@/components/ui/SectionHeading";
import JsonLd from "@/components/JsonLd";
import { getPublicSubscriptionPlans } from "@/lib/api/subscription-plans";
import { breadcrumbSchema, offerCatalogSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Pricing",
  description:
    "Jobzshala pricing for candidates and GCC employers — compare plans, job posting limits, hiring credits and what each tier includes.",
  path: "/pricing",
});

export default async function PricingPage() {
  const plans = await getPublicSubscriptionPlans().catch(() => []);

  return (
    <div className="flex flex-1 flex-col bg-jz-blue-950">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Pricing", path: "/pricing" },
          ]),
          ...(plans.length
            ? [
                offerCatalogSchema(
                  plans.map((plan) => ({
                    name: plan.name,
                    price: plan.price,
                    billingCycle: plan.billing_cycle,
                    audience: plan.user_type,
                  }))
                ),
              ]
            : []),
        ]}
      />
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
