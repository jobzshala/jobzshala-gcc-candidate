import type { Metadata } from "next";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms and Conditions | Jobzshala",
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

export default function TermsConditionsPage() {
  return (
    <div className="flex flex-1 flex-col bg-jz-blue-950">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <h1 className="font-serif text-3xl font-bold text-jz-white-50 sm:text-4xl">Terms and Conditions</h1>
          <p className="mt-3 text-sm text-jz-white-600">Last Updated: July 20, 2026</p>

          <p className="mt-8 text-sm leading-relaxed text-jz-white-200 sm:text-base">
            Welcome to Jobzshala (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our,&rdquo; &ldquo;Jobzshala,&rdquo; &ldquo;Platform&rdquo;). These Terms and
            Conditions (&ldquo;Terms&rdquo;) govern your access to and use of the Jobzshala website, mobile application, and related services
            (collectively, the &ldquo;Services&rdquo;), which connect candidates in India with employers in the Gulf Cooperation Council (GCC)
            region, including the UAE, Saudi Arabia, Qatar, Oman, Kuwait, and Bahrain.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-jz-white-200 sm:text-base">
            By accessing or using the Services, you agree to be bound by these Terms. If you do not agree, please do not use the Services.
          </p>

          <div className="mt-10">
            <Section id="eligibility" title="1. Eligibility">
              <List
                items={[
                  "You must be at least 18 years of age to use the Services.",
                  "Candidates must provide accurate, complete, and truthful information regarding their identity, qualifications, and work history.",
                  "Employers must be legally registered entities authorized to hire in their respective jurisdiction and must provide accurate company and hiring details.",
                ]}
              />
            </Section>

            <Section id="nature-of-services" title="2. Nature of Services">
              <p>
                Jobzshala is a workforce infrastructure platform that facilitates connections between candidates and GCC employers using
                AI-based matching technology. Jobzshala:
              </p>
              <List
                items={[
                  <>
                    Is <strong className="text-jz-white-50">not</strong> an employer of candidates placed through the Platform
                  </>,
                  <>
                    Does <strong className="text-jz-white-50">not</strong> guarantee employment, visa approval, or job placement outcomes
                  </>,
                  "Acts as an intermediary facilitating discovery, matching, and communication between candidates and employers",
                ]}
              />
              <p>
                Final hiring decisions, employment terms, and visa/work permit processes are the sole responsibility of the employer and
                candidate involved, subject to applicable GCC country laws.
              </p>
            </Section>

            <Section id="account-registration" title="3. Account Registration">
              <List
                items={[
                  "Users (candidates and employers) must create an account to access certain features of the Platform.",
                  "You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account.",
                  "Jobzshala reserves the right to suspend or terminate accounts that provide false information, violate these Terms, or engage in fraudulent activity.",
                ]}
              />
            </Section>

            <Section id="service-fees" title="4. Service Fees">
              <p>
                Jobzshala charges a service fee to <strong className="text-jz-white-50">both candidates and employers</strong> for the use
                of certain Platform features, which may include (as applicable):
              </p>
              <List
                items={[
                  "Profile verification and skill-badge certification",
                  "Access to AI-powered job/candidate matching",
                  "Premium visibility or featured listing services",
                  "Application processing support",
                ]}
              />
              <p className="font-semibold text-jz-white-50">Key terms regarding fees:</p>
              <List
                items={[
                  "Applicable fees, if any, will be clearly displayed to the user before payment is made.",
                  "All fees are charged in the currency and manner specified at the time of transaction.",
                  "Fees are generally non-refundable except as required by law or as explicitly stated in a specific service's terms at the time of purchase.",
                  "Jobzshala reserves the right to revise its fee structure at any time, with reasonable prior notice to users.",
                  "Payment is processed through secure third-party payment gateways; Jobzshala does not store full payment card details.",
                ]}
              />
              <p>
                Candidates should be cautious of any party requesting payment outside official Jobzshala channels and should verify all fee
                requests directly through the Platform.
              </p>
            </Section>

            <Section id="candidate-responsibilities" title="5. Candidate Responsibilities">
              <List
                items={[
                  "Provide accurate and truthful information in your profile, resume, and documents.",
                  "Do not misrepresent qualifications, work experience, or identity.",
                  "Cooperate with reasonable verification checks requested by Jobzshala or prospective employers.",
                  "Independently verify job offers and employer legitimacy before making any commitments or travel arrangements.",
                ]}
              />
            </Section>

            <Section id="employer-responsibilities" title="6. Employer Responsibilities">
              <List
                items={[
                  "Post accurate and lawful job opportunities, including accurate wage, role, and working condition details.",
                  "Comply with all applicable labor laws in the hiring country, including fair wage and worker protection regulations.",
                  "Do not engage in discriminatory hiring practices prohibited by applicable law.",
                  "Do not request candidates to pay recruitment fees prohibited under GCC labor regulations, where applicable.",
                ]}
              />
            </Section>

            <Section id="prohibited-conduct" title="7. Prohibited Conduct">
              <p>Users may not:</p>
              <List
                items={[
                  "Submit false, misleading, or fraudulent information",
                  "Use the Platform for any unlawful purpose, including human trafficking or exploitative labor practices",
                  "Attempt to bypass, hack, or interfere with Platform security or functionality",
                  "Scrape, copy, or misuse data from the Platform without authorization",
                  "Harass, threaten, or discriminate against other users",
                ]}
              />
              <p>
                Violation of this section may result in immediate account suspension or termination, and may be reported to relevant
                authorities.
              </p>
            </Section>

            <Section id="ai-matching-disclaimer" title="8. AI-Based Matching Disclaimer">
              <p>
                Jobzshala uses AI and automated systems to assist in candidate-job matching. While we strive for accuracy, AI-generated
                matches are provided on an &ldquo;as-is&rdquo; basis and do not guarantee suitability, accuracy, or successful placement.
                Users should independently evaluate all matches and opportunities.
              </p>
            </Section>

            <Section id="intellectual-property" title="9. Intellectual Property">
              <p>
                All content on the Platform, including logos, design, software, and text (excluding user-submitted content), is the
                property of Jobzshala and protected under applicable intellectual property laws. Users may not reproduce, distribute, or
                create derivative works without prior written consent.
              </p>
            </Section>

            <Section id="limitation-of-liability" title="10. Limitation of Liability">
              <p>To the maximum extent permitted by law:</p>
              <List
                items={[
                  "Jobzshala is not liable for any direct, indirect, incidental, or consequential damages arising from use of the Services, including but not limited to failed job placements, visa denials, employment disputes, or third-party actions.",
                  "Jobzshala does not guarantee the accuracy, completeness, or reliability of information provided by candidates or employers.",
                  "Users engage with each other and enter into employment relationships at their own risk.",
                ]}
              />
            </Section>

            <Section id="indemnification" title="11. Indemnification">
              <p>
                You agree to indemnify and hold Jobzshala harmless from any claims, damages, losses, or expenses arising from your
                violation of these Terms, misuse of the Platform, or your interactions with other users.
              </p>
            </Section>

            <Section id="termination" title="12. Termination">
              <p>
                Jobzshala reserves the right to suspend or terminate any account, with or without notice, for violation of these Terms,
                suspected fraud, or unlawful activity. Users may also close their accounts at any time by contacting support.
              </p>
            </Section>

            <Section id="governing-law" title="13. Governing Law and Dispute Resolution">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these
                Terms shall be subject to the exclusive jurisdiction of the courts located in Bangalore, Karnataka, India, unless
                otherwise required by applicable GCC country law for employment-related disputes.
              </p>
            </Section>

            <Section id="changes-to-terms" title="14. Changes to These Terms">
              <p>
                Jobzshala may update these Terms from time to time. Material changes will be communicated via the Platform or email.
                Continued use of the Services after changes constitutes acceptance of the updated Terms.
              </p>
            </Section>

            <Section id="contact-us" title="15. Contact Us">
              <p>For questions regarding these Terms, please contact:</p>
              <p>
                <strong className="text-jz-white-50">Jobzshala</strong>
                <br />
                Email: <a href="mailto:legal@jobzshala.com" className="text-jz-blue-400 hover:underline">legal@jobzshala.com</a>
                <br />
                Address: 3rd Floor, K.R. Garden, 4, 6th Cross Rd, Nanjappa Reddy Layout, Koramangala 8th Block, Koramangala, Bengaluru,
                Karnataka 560095
              </p>
            </Section>
          </div>

          <p className="mt-10 border-t border-jz-grey-400 pt-6 text-xs text-jz-white-600 italic">
            This document is a template and should be reviewed by a qualified legal professional familiar with Indian contract law and
            applicable GCC country employment/recruitment regulations before publishing, to ensure full legal compliance — particularly
            around fee collection from candidates, which is regulated or restricted in some GCC jurisdictions.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
