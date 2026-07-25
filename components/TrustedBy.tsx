"use client";

import { useTranslation } from "react-i18next";
import { SparkleIcon } from "./ui/icons";
import FlagIcon, { type GccCountryCode } from "./ui/FlagIcon";

// Index-matched to trustedBy.countries. SVG rather than emoji — Windows renders
// flag emoji as bare region letters ("AE"). See components/ui/FlagIcon.
const COUNTRY_CODES: GccCountryCode[] = ["AE", "SA", "QA", "OM", "KW", "BH"];

type Stat = { value: string; label: string };

export default function TrustedBy() {
  const { t } = useTranslation();
  const countries = t("trustedBy.countries", { returnObjects: true }) as string[];
  const stats = t("trustedBy.stats", { returnObjects: true }) as Stat[];
  const badges = t("trustedBy.badges", { returnObjects: true }) as string[];
  const headingHighlight = t("trustedBy.headingHighlight", { defaultValue: "" });

  return (
    <section className="bg-jz-blue-950 py-14">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <h2 className="font-serif text-2xl font-semibold text-jz-white-50 sm:text-3xl">
          {t("trustedBy.heading")}
          {headingHighlight ? <> <em className="italic">{headingHighlight}</em></> : null}
        </h2>

        <div className="mt-7 flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className="flex flex-1 flex-col gap-2">
            <span className="text-sm text-jz-white-600">{t("trustedBy.industriesLabel")}</span>
            {/* Wraps rather than staying on one line: this string is ~630px wide,
                so whitespace-nowrap here forced the whole page into horizontal
                overflow on phones. Wide screens still render it on one line. */}
            <div className="flex min-h-[52px] items-center rounded-2xl border border-jz-grey-400 bg-jz-bg-primary px-4 py-2.5">
              <span className="text-sm font-light text-jz-white-50">{t("trustedBy.industries")}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm text-jz-white-600">{t("trustedBy.acrossLabel")}</span>
            <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-jz-grey-400 bg-jz-bg-primary p-1">
              {countries.map((country, i) => (
                <span key={country} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-light whitespace-nowrap text-jz-white-50">
                  <FlagIcon code={COUNTRY_CODES[i]} />
                  {country}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 divide-y divide-jz-grey-400 overflow-hidden rounded-2xl border border-jz-grey-400 bg-gradient-to-r from-jz-bg-primary to-jz-blue-900 sm:grid-cols-3 sm:divide-y-0 md:grid-cols-5">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-7 text-center ${
                i !== 0 ? "sm:border-l sm:border-jz-grey-400" : ""
              }`}
            >
              <p className="font-serif text-3xl font-semibold text-jz-white-50 sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-xs text-jz-white-600">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-jz-grey-400 bg-jz-bg-primary px-4 py-3">
          {badges.map((badge) => (
            <div key={badge} className="flex items-center gap-2 text-sm text-jz-white-50">
              <SparkleIcon className="size-4 text-jz-blue-400" />
              {badge}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
