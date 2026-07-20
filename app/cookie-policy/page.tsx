import type { Metadata } from "next";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cookie Policy | Jobzshala",
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

export default function CookiePolicyPage() {
  return (
    <div className="flex flex-1 flex-col bg-jz-blue-950">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <h1 className="font-serif text-3xl font-bold text-jz-white-50 sm:text-4xl">Cookie Policy</h1>
          <p className="mt-3 text-sm text-jz-white-600">Last Updated: July 20, 2026</p>

          <p className="mt-8 text-sm leading-relaxed text-jz-white-200 sm:text-base">
            This Cookie Policy explains how Jobzshala (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our,&rdquo; &ldquo;Jobzshala,&rdquo;
            &ldquo;Platform&rdquo;) uses cookies and similar tracking technologies on our website and mobile application, which connect
            candidates in India with employers across the Gulf Cooperation Council (GCC) region. This Policy should be read together with
            our{" "}
            <a href="/privacy-policy" className="text-jz-blue-400 hover:underline">
              Privacy Policy
            </a>
            .
          </p>

          <div className="mt-10">
            <Section id="what-are-cookies" title="1. What Are Cookies">
              <p>
                Cookies are small text files placed on your device when you visit a website. They help the website remember information
                about your visit, such as your preferred language and other settings, which can make your next visit easier and the site
                more useful to you. Similar technologies include local storage, pixels, and SDKs used within our mobile application.
              </p>
            </Section>

            <Section id="how-we-use-cookies" title="2. How We Use Cookies">
              <p>We use cookies to:</p>
              <List
                items={[
                  "Keep you signed in and remember your session",
                  "Remember your language and theme preferences",
                  "Understand how the Platform is used, so we can improve performance and features",
                  "Measure the effectiveness of our AI-based matching and platform features",
                  "Protect the Platform against fraud and unauthorized access",
                ]}
              />
            </Section>

            <Section id="types-of-cookies" title="3. Types of Cookies We Use">
              <div>
                <p className="font-semibold text-jz-white-50">3.1 Strictly Necessary Cookies</p>
                <p>
                  Required for the Platform to function, including authentication, security, and session management. These cannot be
                  disabled without affecting core functionality.
                </p>
              </div>
              <div>
                <p className="font-semibold text-jz-white-50">3.2 Functional / Preference Cookies</p>
                <p>
                  Remember choices you make, such as language (English, Hindi, Kannada, Tamil, Malayalam, Arabic, Telugu) and light/dark
                  theme, so you do not need to reset them on every visit.
                </p>
              </div>
              <div>
                <p className="font-semibold text-jz-white-50">3.3 Analytics / Performance Cookies</p>
                <p>
                  Help us understand how candidates and employers use the Platform, so we can identify and fix issues and improve the
                  AI-based matching experience.
                </p>
              </div>
              <div>
                <p className="font-semibold text-jz-white-50">3.4 Third-Party Cookies</p>
                <p>
                  Some cookies may be set by trusted third-party service providers who support Platform operations (e.g., payment
                  processing, identity verification, analytics). These providers are bound by their own privacy and security
                  obligations.
                </p>
              </div>
            </Section>

            <Section id="managing-cookies" title="4. Managing Your Cookie Preferences">
              <p>You can control or delete cookies through your browser settings at any time. Most browsers allow you to:</p>
              <List
                items={[
                  "View what cookies are stored and delete them individually",
                  "Block third-party cookies",
                  "Block cookies from particular or all sites",
                  "Delete all cookies when you close your browser",
                ]}
              />
              <p>
                Please note that blocking or deleting strictly necessary cookies may affect the functionality of the Platform, including
                your ability to log in or complete transactions.
              </p>
            </Section>

            <Section id="changes-to-policy" title="5. Changes to This Policy">
              <p>
                Jobzshala may update this Cookie Policy from time to time. Material changes will be communicated via the Platform or
                email. Continued use of the Services after changes constitutes acceptance of the updated Policy.
              </p>
            </Section>

            <Section id="contact-us" title="6. Contact Us">
              <p>For questions regarding this Cookie Policy, please contact:</p>
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
            (DPDP Act 2023) and applicable GCC country regulations before publishing, to ensure full legal compliance — particularly
            around any cookie-consent banner requirements that may apply in your target markets.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
