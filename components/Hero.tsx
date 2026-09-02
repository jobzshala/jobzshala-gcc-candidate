"use client";

import { useTranslation } from "react-i18next";
import Button from "./ui/Button";
import { SparkleIcon } from "./ui/icons";
import { splitHighlight } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";

type Stat = { value: string; label: string };

export default function Hero() {
  const { t } = useTranslation();
  const badges = t("hero.badges", { returnObjects: true }) as string[];

  const stats = t("trustedBy.stats", { returnObjects: true }) as Stat[];
  const [titleBefore, titleHighlight, titleAfter] = splitHighlight(t("hero.title"), t("hero.titleHighlight"));

  return (

    <section className="surface-always-dark bg-[url('/images/hero-bg-dubai.webp')] bg-cover bg-bottom bg-no-repeat">
      <div className="mx-auto max-w-[1219px] px-4 pt-16 pb-16 sm:px-6 lg:px-10 lg:pt-[88px] lg:pb-24">
        <div className="mx-auto flex max-w-[860px] flex-col items-center text-center">
          <div className="inline-flex h-8.5 items-center gap-1 rounded border border-white/15 bg-white/5 px-3 py-1 text-xs text-jz-white-50">
            <SparkleIcon className="size-4 shrink-0 text-jz-yellow-400" />
            {t("hero.tagline")}
          </div>

          <h1 className="mt-6 font-serif text-3xl font-bold leading-tight tracking-[0.01em] text-jz-white-50 sm:text-4xl lg:text-[42px] lg:leading-[1.2]">
            {titleBefore}
            {titleHighlight && (
              <span className="text-[#FECC00]">{titleHighlight}</span>
            )}
            {titleAfter}
          </h1>

          <p className="mt-5 max-w-2xl text-xs text-jz-white-400 sm:text-sm">
            {t("hero.subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              variant="primary"
              href="/hire/login"
              className="bg-[#FECC00]"
            >
              {t("hero.primaryCta")}
            </Button>
            <Button variant="secondary" href={ROUTES.register}>
              {t("hero.secondaryCta")}
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1   max-w-2xl text-xs text-jz-white-400 sm:text-sm">
            {badges.map((badge, i) => (
              <span key={badge} className="flex items-center gap-1">
                {i > 0 && (
                  <span aria-hidden="true" className="text-jz-white">
                    &middot;
                  </span>
                )}
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xxs sm:grid-cols-3 md:grid-cols-5 lg:mt-[85px]">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`relative flex flex-col items-center gap-1 px-3 py-5 text-center sm:px-4 sm:py-6 ${

                i >= 2 ? "border-t border-white/15 sm:border-t-0" : ""
              } ${i % 2 === 1 ? "border-l border-white/15 sm:border-l-0" : ""} ${
                // Odd count — let the last stat fill the row on mobile.
                i === stats.length - 1 && stats.length % 2 === 1 ? "col-span-2 sm:col-auto" : ""
              } ${
                i !== 0
                  ? "sm:before:absolute sm:before:left-0 sm:before:top-1/2 sm:before:h-15 sm:before:w-px sm:before:-translate-y-1/2 sm:before:bg-white/80 sm:before:content-['']"
                  : ""
              }`}
            >
              <p className="font-serif text-2xl font-semibold text-jz-white-50 sm:text-3xl md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-[11px] text-jz-white-400 sm:text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
