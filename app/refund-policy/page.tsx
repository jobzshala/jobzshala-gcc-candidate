import type { Metadata } from "next";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Refund Policy | Jobzshala",
};

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-jz-grey-400 py-8 first:border-t-0 first:pt-0">
      <h2 className="font-serif text-xl font-semibold text-jz-white-50 sm:text-2xl">{title}</h2>
      <div className="mt-4 flex flex-col gap-4 text-sm leading-relaxed text-jz-white-200 sm:text-base">{children}</div>
    </section>
  );
}

function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex flex-col gap-2 pl-5">
      {items.map((item, i) => (
        <li key={i} className="list-disc">
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function RefundPolicyPage() {
  return (
    <div className="flex flex-1 flex-col bg-jz-blue-950">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <h1 className="font-serif text-3xl font-bold text-jz-white-50 sm:text-4xl">Refund Policy</h1>
          <p className="mt-3 text-sm text-jz-white-600">Last Updated: July 20, 2026</p>

          <p className="mt-8 text-sm leading-relaxed text-jz-white-200 sm:text-base">
            This Refund Policy explains how Jobzshala (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our,&rdquo; &ldquo;Jobzshala,&rdquo;
            &ldquo;Platform&rdquo;) handles refund requests for service fees paid by candidates and employers on our workforce
            infrastructure platform connecting candidates in India with employers across the Gulf Cooperation Council (GCC) region,
            including the UAE, Saudi Arabia, Qatar, Oman, Kuwait, and Bahrain. This Policy should be read together with our{" "}
            <a href="/terms-conditions" className="text-jz-blue-400 hover:underline">
              Terms and Conditions
            </a>
            .
          </p>

          <div className="mt-10">
            <Section id="general-policy" title="1. General Policy">
              <List
                items={[
                  "As stated in our Terms and Conditions, service fees charged by Jobzshala are generally non-refundable once the corresponding service has been delivered or initiated.",
                  "This reflects the cost of AI-based matching, recruiter verification, and platform operations that begin as soon as a paid service is activated.",
                ]}
              />
            </Section>

            <Section id="fees-covered" title="2. Fees Covered by This Policy">
              <p>This Policy applies to fees paid for:</p>
              <List
                items={[
                  "Profile verification and skill-badge certification",
                  "Access to AI-powered job/candidate matching",
                  "Premium visibility or featured listing services",
                  "Application processing support",
                ]}
              />
            </Section>

            <Section id="eligible-refunds" title="3. Circumstances Eligible for a Refund">
              <p>A refund may be considered in the following circumstances, subject to review:</p>
              <List
                items={[
                  "A duplicate or erroneous payment charged in error by Jobzshala",
                  "A technical failure that prevented the paid service from being delivered",
                  "A paid service that was never activated or accessed by the user",
                  "Cancellation made within 24 hours of purchase, before the service has been used, where permitted by law",
                ]}
              />
            </Section>

            <Section id="ineligible-refunds" title="4. Circumstances Not Eligible for a Refund">
              <p>Refunds will generally not be granted where:</p>
              <List
                items={[
                  "The service (e.g., verification, matching, listing) has already been delivered",
                  "The user changes their mind after the service has been used",
                  "Employment or placement outcomes do not meet expectations, since Jobzshala does not guarantee job placement or hiring outcomes",
                  "The account was suspended or terminated for violation of our Terms and Conditions",
                ]}
              />
            </Section>

            <Section id="how-to-request" title="5. How to Request a Refund">
              <List
                items={[
                  "Refund requests must be submitted in writing to support@jobzshala.com within 7 days of the original transaction.",
                  "Include your registered account email or mobile number, the transaction ID or receipt, and the reason for the request.",
                  "Jobzshala will acknowledge receipt of your request within 2 business days.",
                ]}
              />
            </Section>

            <Section id="review-timeline" title="6. Review and Processing Timeline">
              <List
                items={[
                  "Refund requests are reviewed on a case-by-case basis and typically resolved within 7–10 business days of submission.",
                  "Approved refunds are credited to the original payment method within 5–10 business days, depending on the payment gateway and bank processing times.",
                  "Jobzshala reserves the right to request additional information or documentation to verify a refund request.",
                ]}
              />
            </Section>

            <Section id="gateway-charges" title="7. Payment Gateway Charges">
              <p>
                Any transaction or processing charges levied by the third-party payment gateway are non-refundable and may be deducted
                from the refunded amount, where applicable.
              </p>
            </Section>

            <Section id="employer-terms" title="8. Employer-Specific Terms">
              <p>
                Employers requesting refunds for bulk or subscription-based hiring plans should refer to the specific terms provided at
                the time of purchase, which take precedence over this general Policy where they conflict.
              </p>
            </Section>

            <Section id="candidate-terms" title="9. Candidate-Specific Terms">
              <p>
                Candidates should note that Jobzshala does not charge fees prohibited under GCC labor regulations. If you believe you
                have been charged a fee that violates applicable labor law in your destination country, please contact us immediately.
              </p>
            </Section>

            <Section id="changes-to-policy" title="10. Changes to This Policy">
              <p>
                Jobzshala may update this Refund Policy from time to time. Material changes will be communicated via the Platform or
                email. Continued use of the Services after changes constitutes acceptance of the updated Policy.
              </p>
            </Section>

            <Section id="contact-us" title="11. Contact Us">
              <p>For questions regarding this Refund Policy, please contact:</p>
              <p>
                <strong className="text-jz-white-50">Jobzshala</strong>
                <br />
                Email: <a href="mailto:support@jobzshala.com" className="text-jz-blue-400 hover:underline">support@jobzshala.com</a>
                <br />
                Address: 3rd Floor, K.R. Garden, 4, 6th Cross Rd, Nanjappa Reddy Layout, Koramangala 8th Block, Koramangala, Bengaluru,
                Karnataka 560095
              </p>
            </Section>
          </div>

          <p className="mt-10 border-t border-jz-grey-400 pt-6 text-xs text-jz-white-600 italic">
            This document is a template and should be reviewed by a qualified legal professional familiar with Indian consumer protection
            law and applicable GCC country regulations before publishing, to ensure full legal compliance — particularly around the
            specific refund windows and timelines, which should reflect your actual operational and payment-gateway capabilities.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
