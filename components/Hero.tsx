"use client";

import { Fragment } from "react";
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
  const [titleBefore, titleHighlight, titleAfter] = splitHighlight(
    t("hero.title"),
    t("hero.titleHighlight"),
  );

  return (
    <section className="font-poppins">
      <div className="surface-always-dark min-h-dvh bg-[url('/images/hero-mobile.webp')] bg-cover bg-bottom bg-no-repeat sm:min-h-0 sm:bg-[url('/images/hero-bg-dubai.webp')]">
        <div className="mx-auto max-w-304.75 px-4 pt-14 pb-10 sm:px-6 sm:pt-16 sm:pb-24 lg:px-10 lg:pt-[120px] lg:pb-32">
          <div className="mx-auto flex max-w-238.25 flex-col items-start gap-5 text-left sm:items-center sm:gap-6 sm:text-center">
            <div className="flex h-15 w-full items-start gap-1 rounded bg-white/10 px-3 py-1 text-base font-normal leading-6.5 tracking-[0.01em] text-[#F2F2F2] sm:inline-flex sm:h-8.5 sm:w-auto sm:items-center">
              <SparkleIcon className="mt-1.25 size-4 shrink-0 text-jz-yellow-400 sm:mt-0" />
              {t("hero.tagline")}
            </div>

            <h1 className="text-[36px] font-bold leading-11.5 tracking-[0.01em] text-[#F2F2F2] sm:text-4xl sm:leading-tight lg:text-[52px] lg:leading-[64px]">
              {titleBefore}
              {titleHighlight && (
                <span className="text-[#FECC00]">{titleHighlight}</span>
              )}
              {titleAfter}
            </h1>

            <p className="max-w-2xl text-base leading-6.5 tracking-[0.01em] text-[#F2F2F2] sm:text-sm sm:leading-normal sm:text-jz-white-400">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
              <Button
                variant="primary"
                href="/hire/login"
                className="gap-1 bg-[#FECC00] bg-none px-5 py-3 text-base font-medium leading-6.5 tracking-[0.01em] text-[#212121] sm:gap-1.5 sm:bg-gradient-to-b sm:px-4 sm:py-2 sm:text-sm sm:font-semibold sm:text-jz-ink-on-accent"
              >
                {t("hero.primaryCta")}
              </Button>
              <Button
                variant="secondary"
                href={ROUTES.register}
                className="gap-1 border border-[#00587F] px-5 py-3 text-base leading-6.5 sm:gap-1.5 sm:border-0 sm:px-4 sm:py-2 sm:text-sm"
              >
                {t("hero.secondaryCta")}
              </Button>
            </div>

            <div className="flex max-w-2xl flex-wrap items-center gap-x-3 gap-y-1 text-base leading-6.5 tracking-[0.01em] text-[#F2F2F2] sm:justify-center sm:text-sm sm:leading-normal sm:tracking-normal sm:text-jz-white-400">
              {badges.map((badge, i) => (
                <span key={badge} className="flex items-center gap-1">
                  {badge}
                  {i < badges.length - 1 && (
                    <span aria-hidden="true" className="text-jz-white">
                      &middot;
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* From md up the stats sit on the photo, inside its padded container. */}
          <div className="mt-14 hidden grid-cols-5 overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xxs md:grid lg:mt-[85px]">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`relative flex flex-col items-center gap-1 px-4 py-6 text-center ${
                  i !== 0
                    ? "before:absolute before:left-0 before:top-1/2 before:h-15 before:w-px before:-translate-y-1/2 before:bg-white/80 before:content-['']"
                    : ""
                }`}
              >
                <p className="text-3xl font-semibold leading-tight tracking-[0.01em] text-jz-white-50 lg:text-4xl">
                  {stat.value}
                </p>
                <p className="text-xs font-normal leading-normal tracking-[0.01em] text-jz-white-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Below md the design drops the stats under the photo, in a light card. */}
      <div className="mx-4 mt-5 flex flex-col gap-7 overflow-hidden rounded-2xl bg-[#EEF3FF] pt-7 pr-19 pb-7 pl-8 md:hidden">
        {stats.map((stat, i) => (
          <Fragment key={stat.label}>
            {i > 0 && (
              <span aria-hidden="true" className="h-px w-22 bg-[#DFE6EA]" />
            )}
            <div className="flex flex-col gap-1">
              <p className="text-[40px] font-bold leading-[54px] tracking-[0.01em] text-[#1A1A1A]">
                {stat.value}
              </p>
              <p className="text-base font-normal leading-6.5 tracking-[0.01em] text-[#4A4A4A]">
                {stat.label}
              </p>
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
