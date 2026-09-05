"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import Logo from "./ui/Logo";
import FlagIcon, { type GccCountryCode } from "./ui/FlagIcon";

// Index-matched to footer.countries. Emoji flags were showing as bare region
// letters ("AE") on Windows, which has no flag glyphs — see components/ui/FlagIcon.
const COUNTRY_CODES: GccCountryCode[] = ["AE", "SA", "QA", "OM", "KW", "BH"];

// Index-matched to footer.legal.links (Privacy Policy, Terms & Conditions,
// Refund Policy, Cookie Policy, Site map).
const LEGAL_LINK_HREFS = [
  "/privacy-policy",
  "/terms-conditions",
  "/refund-policy",
  "/cookie-policy",
  "/sitemap",
];

// Index-matched to footer.company.links (About Us, Contact Us, Blog,
// Success Stories, Pricing, FAQ).
const COMPANY_LINK_HREFS = [
  "/about-us",
  "/contact-us",
  "/blog",
  "/success-stories",
  "/pricing",
  undefined,
];

// Index-matched to footer.services.links (Recruitment Solutions, Workforce
// Infrastructure, AI Matching, Candidate Verification, Visa Assistance,
// Deployment Support).
const SERVICES_LINK_HREFS = [
  "/solutions/recruitment-solutions",
  "/solutions/workforce-infrastructure",
  "/solutions/ai-matching",
  "/solutions/candidate-verification",
  "/solutions/visa-assistance",
  undefined,
];

type LinkGroup = { title: string; links: string[] };

export default function Footer() {
  const { t } = useTranslation();
  const company = t("footer.company", { returnObjects: true }) as LinkGroup;
  const services = t("footer.services", { returnObjects: true }) as LinkGroup;
  const legal = t("footer.legal", { returnObjects: true }) as LinkGroup;
  const countries = t("footer.countries", { returnObjects: true }) as string[];

  const groups = [company, services, legal];

  return (
    <footer className="surface-always-dark bg-[#04161F] font-poppins">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-10 px-4 py-8 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo />
            <p className="mt-2 text-xs text-white">
              {t("footer.brandTagline")}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-6.5 text-jz-white-400">
              {t("footer.tagline")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {groups.map((group) => {
              const hrefs =
                group === legal
                  ? LEGAL_LINK_HREFS
                  : group === company
                    ? COMPANY_LINK_HREFS
                    : SERVICES_LINK_HREFS;
              return (
                <div key={group.title}>
                  <h4 className="text-sm font-semibold text-jz-white-50">
                    {group.title}
                  </h4>
                  <ul className="mt-3 flex flex-col gap-2">
                    {group.links.map((link, i) => (
                      <li key={link}>
                        {hrefs[i] ? (
                          <Link
                            href={hrefs[i]}
                            className="text-sm text-jz-white-400 hover:text-jz-yellow-400"
                          >
                            {link}
                          </Link>
                        ) : (
                          <a
                            href="#"
                            className="text-sm text-jz-white-400 hover:text-jz-yellow-400"
                          >
                            {link}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p className="text-xs text-white">{t("footer.copyright")}</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:flex sm:flex-wrap sm:gap-3">
            {countries.map((country, i) => (
              <span
                key={country}
                className="flex items-center gap-1.5 text-xs text-jz-white-400"
              >
                <FlagIcon code={COUNTRY_CODES[i]} />
                {country}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
