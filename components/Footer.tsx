"use client";

import { useTranslation } from "react-i18next";
import Logo from "./ui/Logo";

const COUNTRY_FLAGS = ["🇦🇪", "🇸🇦", "🇶🇦", "🇴🇲", "🇰🇼", "🇧🇭"];

type LinkGroup = { title: string; links: string[] };

export default function Footer() {
  const { t } = useTranslation();
  const company = t("footer.company", { returnObjects: true }) as LinkGroup;
  const services = t("footer.services", { returnObjects: true }) as LinkGroup;
  const legal = t("footer.legal", { returnObjects: true }) as LinkGroup;
  const countries = t("footer.countries", { returnObjects: true }) as string[];

  const groups = [company, services, legal];

  return (
    <footer className="border-t border-jz-grey-400 bg-jz-blue-900">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo />
            <p className="mt-2 text-xs text-jz-white-400">{t("footer.brandTagline")}</p>
            <p className="mt-4 max-w-sm text-sm text-jz-white-400">{t("footer.tagline")}</p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {groups.map((group) => (
              <div key={group.title}>
                <h4 className="text-sm font-semibold text-jz-white-50">{group.title}</h4>
                <ul className="mt-3 flex flex-col gap-2">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-jz-white-400 hover:text-jz-yellow-400">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-jz-grey-400 pt-6">
          <p className="text-xs text-jz-white-600">{t("footer.copyright")}</p>
          <div className="flex flex-wrap gap-3">
            {countries.map((country, i) => (
              <span key={country} className="flex items-center gap-1.5 text-xs text-jz-white-400">
                <span aria-hidden="true">{COUNTRY_FLAGS[i]}</span>
                {country}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
