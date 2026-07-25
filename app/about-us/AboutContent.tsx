"use client";

import { useTranslation } from "react-i18next";
import { GlobeIcon, ShieldCheckIcon, SparkleIcon } from "@/components/ui/icons";
import FlagIcon, { type GccCountryCode } from "@/components/ui/FlagIcon";

// Index-matched to trustedBy.countries — same mapping used on the homepage's
// TrustedBy section.
const COUNTRY_CODES: GccCountryCode[] = ["AE", "SA", "QA", "OM", "KW", "BH"];

type Stat = { value: string; label: string };

export default function AboutContent() {
  const { t } = useTranslation();

  const stats = t("trustedBy.stats", { returnObjects: true }) as Stat[];
  const countries = t("trustedBy.countries", { returnObjects: true }) as string[];
  const industries = t("industries.list", { returnObjects: true }) as string[];
  const features = t("whyChooseUs.features", { returnObjects: true }) as string[];

  return (
    <div className="flex flex-col gap-14">
      {/* Vision */}
      <section className="rounded-2xl border border-jz-grey-400 bg-jz-bg-primary p-8 sm:p-10">
        <span className="text-xs font-semibold uppercase tracking-wide text-jz-yellow-400">{t("vision.heading")}</span>
        <h2 className="mt-3 font-serif text-2xl font-semibold text-jz-white-50 sm:text-3xl">{t("vision.title")}</h2>
        <p className="mt-4 max-w-3xl text-jz-white-200">{t("vision.body")}</p>
      </section>

      {/* Stats */}
      <section>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-jz-grey-400 bg-jz-bg-primary p-5 text-center">
              <p className="font-serif text-2xl font-bold text-jz-yellow-400 sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-xs text-jz-white-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission + Trust & Verification */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-jz-grey-400 bg-jz-bg-primary p-8">
          <span className="flex size-10 items-center justify-center rounded-xl bg-jz-blue-900 text-jz-yellow-400">
            <GlobeIcon className="size-5" />
          </span>
          <h3 className="mt-4 font-serif text-xl font-semibold text-jz-white-50">{t("challenge.mission.title")}</h3>
          <p className="mt-3 text-sm leading-relaxed text-jz-white-400">{t("challenge.mission.body")}</p>
        </div>

        <div className="rounded-2xl border border-jz-grey-400 bg-jz-bg-primary p-8">
          <span className="flex size-10 items-center justify-center rounded-xl bg-jz-blue-900 text-jz-yellow-400">
            <ShieldCheckIcon className="size-5" />
          </span>
          <h3 className="mt-4 font-serif text-xl font-semibold text-jz-white-50">{t("trustVerification.title")}</h3>
          <p className="mt-3 text-sm leading-relaxed text-jz-white-400">
            {t("trustVerification.bodyPrefix")}
            <span className="font-semibold text-jz-white-50">{t("trustVerification.bodyBold")}</span>
            {t("trustVerification.bodySuffix")}
          </p>
        </div>
      </section>

      {/* India → GCC corridor */}
      <section className="rounded-2xl border border-jz-grey-400 bg-jz-bg-primary p-8 sm:p-10">
        <h3 className="font-serif text-xl font-semibold text-jz-white-50">{t("corridor.title")}</h3>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-jz-white-400">{t("corridor.body")}</p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <div className="rounded-xl border border-jz-border bg-jz-blue-900 px-5 py-3 text-center">
            <p className="font-serif text-lg font-semibold text-jz-white-50">{t("corridor.nodeIndia.title")}</p>
            <p className="text-xs text-jz-white-400">{t("corridor.nodeIndia.subtitle")}</p>
          </div>
          <span className="text-jz-yellow-400" aria-hidden="true">
            →
          </span>
          <div className="rounded-xl border border-jz-border bg-jz-blue-900 px-5 py-3 text-center">
            <p className="font-serif text-lg font-semibold text-jz-white-50">{t("corridor.nodeGcc.title")}</p>
            <p className="text-xs text-jz-white-400">{t("corridor.nodeGcc.subtitle")}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {countries.map((country, i) => (
            <span
              key={country}
              className="flex items-center gap-1.5 rounded-full border border-jz-border bg-jz-blue-900 px-3 py-1.5 text-xs text-jz-white-200"
            >
              <FlagIcon code={COUNTRY_CODES[i]} />
              {country}
            </span>
          ))}
        </div>
      </section>

      {/* Industries we power */}
      <section>
        <h3 className="font-serif text-xl font-semibold text-jz-white-50">
          {t("industries.heading")} <em className="italic text-jz-blue-400">{t("industries.headingHighlight")}</em>
        </h3>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {industries.map((industry) => (
            <span
              key={industry}
              className="rounded-full border border-jz-grey-400 bg-jz-bg-primary px-4 py-2 text-sm text-jz-white-200"
            >
              {industry}
            </span>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="rounded-2xl border border-jz-grey-400 bg-jz-bg-primary p-8 sm:p-10">
        <h3 className="font-serif text-xl font-semibold text-jz-white-50">{t("whyChooseUs.subheading")}</h3>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2.5 text-sm text-jz-white-200">
              <SparkleIcon className="size-4 shrink-0 text-jz-yellow-400" />
              {feature}
            </li>
          ))}
        </ul>
        <p className="mt-6 border-t border-jz-grey-400 pt-5 font-serif text-lg italic text-jz-white-50">
          &ldquo;{t("whyChooseUs.quote")}&rdquo;
        </p>
      </section>
    </div>
  );
}
