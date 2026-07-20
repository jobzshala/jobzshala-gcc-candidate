import type { Metadata } from "next";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Jobzshala",
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

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-1 flex-col bg-jz-blue-950">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <h1 className="font-serif text-3xl font-bold text-jz-white-50 sm:text-4xl">Privacy Policy</h1>
          <p className="mt-3 text-sm text-jz-white-600">Last Updated: July 20, 2026</p>

          <p className="mt-8 text-sm leading-relaxed text-jz-white-200 sm:text-base">
            Jobzshala (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our,&rdquo; &ldquo;Jobzshala,&rdquo; &ldquo;Platform&rdquo;) operates a
            workforce infrastructure platform connecting candidates in India with employers in the Gulf Cooperation Council (GCC) region,
            including the United Arab Emirates, Saudi Arabia, Qatar, Oman, Kuwait, and Bahrain. This Privacy Policy explains how we
            collect, use, disclose, and protect your information when you use our website, mobile application, and related services
            (collectively, the &ldquo;Services&rdquo;).
          </p>
          <p className="mt-4 text-sm leading-relaxed text-jz-white-200 sm:text-base">
            By accessing or using the Services, you agree to the terms of this Privacy Policy. If you do not agree, please do not use the
            Services.
          </p>

          <div className="mt-10">
            <Section id="information-we-collect" title="1. Information We Collect">
              <div>
                <p className="font-semibold text-jz-white-50">1.1 Information from Candidates</p>
                <List
                  items={[
                    "Personal identification details (name, date of birth, gender, nationality, photograph)",
                    "Contact information (phone number, email address, residential address)",
                    "Government-issued identification (Aadhaar, passport, PAN, or equivalent)",
                    "Educational qualifications, certifications, and skill verification documents",
                    "Work history, resume/CV, and professional references",
                    "Bank account or payment details (for fee processing and salary-related purposes)",
                    "Location data, when permitted by the user",
                    "Communication records with Jobzshala support or employers",
                  ]}
                />
              </div>
              <div>
                <p className="font-semibold text-jz-white-50">1.2 Information from Employers</p>
                <List
                  items={[
                    "Company name, registration/license details, and business address",
                    "Authorized representative's name and contact details",
                    "Job posting details and hiring requirements",
                    "Payment and billing information",
                    "Communication records with Jobzshala support or candidates",
                  ]}
                />
              </div>
              <div>
                <p className="font-semibold text-jz-white-50">1.3 Automatically Collected Information</p>
                <List
                  items={[
                    "Device information (IP address, browser type, operating system)",
                    "Usage data (pages visited, features used, time spent on Platform)",
                    "Cookies and similar tracking technologies",
                  ]}
                />
              </div>
            </Section>

            <Section id="how-we-use-information" title="2. How We Use Your Information">
              <p>We use collected information to:</p>
              <List
                items={[
                  "Create and manage candidate and employer accounts",
                  "Match candidates with relevant job opportunities using our AI-based matching system",
                  "Verify candidate skills, documents, and eligibility for GCC employment",
                  "Facilitate communication between candidates and employers",
                  "Process payments, including service fees charged to both candidates and employers",
                  "Send job alerts, application updates, and platform notifications",
                  "Improve and personalize the Platform, including through AI/ML-based features",
                  "Comply with applicable legal and regulatory requirements in India and GCC countries",
                  "Prevent fraud, misuse, and unauthorized access to the Platform",
                ]}
              />
            </Section>

            <Section id="service-fees-and-payment" title="3. Service Fees and Payment Information">
              <p>
                Jobzshala charges a service fee to <strong className="text-jz-white-50">both candidates and employers</strong> for use of
                certain Platform features (including but not limited to profile verification, premium listing, and AI-based matching
                services). Payment information collected for this purpose is processed securely and is used solely for:
              </p>
              <List
                items={[
                  "Processing the applicable service fee",
                  "Issuing invoices/receipts",
                  "Fraud prevention and transaction verification",
                ]}
              />
              <p>
                We do not sell payment information to third parties. Payment processing may be handled through third-party payment
                gateway providers, who are bound by their own privacy and security obligations.
              </p>
            </Section>

            <Section id="ai-and-automated-processing" title="4. AI and Automated Processing">
              <p>
                Jobzshala uses AI-based systems (including large language model APIs and vector-based search technology) to match
                candidate profiles with job opportunities. This may involve processing candidate resumes, skills data, and job
                requirements through automated systems. Automated matching results may be reviewed by human staff before being finalized
                in sensitive cases.
              </p>
            </Section>

            <Section id="sharing-of-information" title="5. Sharing of Information">
              <p>We may share your information with:</p>
              <List
                items={[
                  <>
                    <strong className="text-jz-white-50">Employers/Candidates</strong>, as relevant, to facilitate the hiring process
                  </>,
                  <>
                    <strong className="text-jz-white-50">Service providers</strong> who support Platform operations (hosting, payment
                    processing, identity verification, communication tools)
                  </>,
                  <>
                    <strong className="text-jz-white-50">Government or regulatory authorities</strong>, where required by law, for visa
                    processing, labor compliance, or fraud investigation
                  </>,
                  <>
                    <strong className="text-jz-white-50">Business transfer scenarios</strong>, such as a merger, acquisition, or sale of
                    assets
                  </>,
                ]}
              />
              <p>We do not sell personal information to third parties for marketing purposes.</p>
            </Section>

            <Section id="data-storage-and-security" title="6. Data Storage and Security">
              <p>
                We implement reasonable technical and organizational safeguards, including encryption, access controls, and secure
                infrastructure, to protect your information. However, no method of transmission or storage is completely secure, and we
                cannot guarantee absolute security.
              </p>
              <p>Data may be stored on servers located in India and/or other jurisdictions as required for Platform operations.</p>
            </Section>

            <Section id="data-retention" title="7. Data Retention">
              <p>
                We retain personal information for as long as necessary to fulfill the purposes outlined in this Policy, comply with
                legal obligations, resolve disputes, and enforce our agreements. Candidates and employers may request deletion of their
                data, subject to legal retention requirements.
              </p>
            </Section>

            <Section id="your-rights" title="8. Your Rights">
              <p>Subject to applicable law, you may have the right to:</p>
              <List
                items={[
                  "Access the personal information we hold about you",
                  "Request correction of inaccurate information",
                  "Request deletion of your account and associated data",
                  "Withdraw consent for optional data processing (e.g., marketing communications)",
                  "Object to certain uses of your information",
                ]}
              />
              <p>
                Requests can be made by contacting us at{" "}
                <a href="mailto:privacy@jobzshala.com" className="text-jz-blue-400 hover:underline">
                  privacy@jobzshala.com
                </a>
                .
              </p>
            </Section>

            <Section id="cookies" title="9. Cookies">
              <p>
                The Platform uses cookies and similar technologies to improve user experience, remember preferences, and analyze usage
                patterns. You can control cookie preferences through your browser settings.
              </p>
            </Section>

            <Section id="childrens-privacy" title="10. Children's Privacy">
              <p>
                The Services are not intended for individuals under 18 years of age. We do not knowingly collect information from
                minors.
              </p>
            </Section>

            <Section id="international-data-transfers" title="11. International Data Transfers">
              <p>
                Given Jobzshala&rsquo;s operations across India and GCC countries, your information may be transferred to and processed
                in countries other than your country of residence. We take steps to ensure such transfers comply with applicable data
                protection laws.
              </p>
            </Section>

            <Section id="changes-to-this-policy" title="12. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. Material changes will be notified via the Platform or email.
                Continued use of the Services after changes constitutes acceptance of the updated Policy.
              </p>
            </Section>

            <Section id="contact-us" title="13. Contact Us">
              <p>For questions or concerns regarding this Privacy Policy, please contact:</p>
              <p>
                <strong className="text-jz-white-50">Jobzshala</strong>
                <br />
                Email: <a href="mailto:privacy@jobzshala.com" className="text-jz-blue-400 hover:underline">privacy@jobzshala.com</a>
                <br />
                Address: 3rd Floor, K.R. Garden, 4, 6th Cross Rd, Nanjappa Reddy Layout, Koramangala 8th Block, Koramangala, Bengaluru,
                Karnataka 560095
              </p>
            </Section>
          </div>

          <p className="mt-10 border-t border-jz-grey-400 pt-6 text-xs text-jz-white-600 italic">
            This document is a template and should be reviewed by a qualified legal professional familiar with Indian data protection law
            (DPDP Act 2023) and applicable GCC country regulations before publishing, to ensure full legal compliance.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
