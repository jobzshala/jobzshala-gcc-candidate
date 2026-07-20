"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import Button from "./ui/Button";
import { SparkleIcon } from "./ui/icons";
import { splitHighlight } from "@/lib/utils";

export default function Hero() {
  const { t } = useTranslation();
  const badges = t("hero.badges", { returnObjects: true }) as string[];
  const [titleBefore, titleHighlight, titleAfter] = splitHighlight(t("hero.title"), t("hero.titleHighlight"));

  return (
    <section className="relative overflow-hidden bg-jz-blue-950">
      <div className="absolute inset-y-0 right-0 w-full lg:w-[58%]">
        <Image
          src="/images/hero-banner.jpg"
          alt={t("hero.imageAlt")}
          fill
          priority
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-cover object-right"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-jz-blue-950 via-jz-blue-950/95 via-45% to-jz-blue-950/50 lg:to-transparent" />
      <div aria-hidden="true" className="absolute inset-y-0 left-[30%] w-72 bg-jz-blue-400/20 blur-[130px]" />

      <div className="relative mx-auto max-w-[1440px] px-4 pt-14 pb-10 sm:px-6 lg:px-10 lg:pt-20 lg:pb-14">
        <div className="max-w-xl">
          <div className="inline-flex rounded-full bg-gradient-to-r from-jz-yellow-400/70 via-jz-blue-400/70 to-jz-blue-400/70 p-px shadow-[0_0_24px_-6px_rgba(0,178,255,0.6)]">
            <div className="inline-flex items-center gap-2 rounded-full bg-jz-blue-950 px-4 py-2 text-xs text-jz-white-100">
              <SparkleIcon className="size-3.5 text-jz-yellow-400" />
              {t("hero.tagline")}
            </div>
          </div>

          <h1 className="mt-5 font-serif text-4xl font-bold leading-tight text-jz-white-50 sm:text-5xl">
            {titleBefore}
            {titleHighlight && <span className="italic text-jz-blue-400">{titleHighlight}</span>}
            {titleAfter}
          </h1>
          <p className="mt-6 max-w-xl text-jz-white-400">{t("hero.subtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button variant="primary" href="/hire/login">
              {t("hero.primaryCta")}
            </Button>
            <Button variant="secondary" href="/register">
              {t("hero.secondaryCta")}
            </Button>
          </div>
        </div>
      </div>

      <div className="relative border-t border-jz-white-800">
        <div className="mx-auto flex max-w-[1440px] flex-wrap gap-x-8 gap-y-2 px-4 py-4 sm:px-6 lg:px-10">
          {badges.map((badge) => (
            <div key={badge} className="flex items-center gap-2.5 text-sm text-jz-white-200">
              <SparkleIcon className="size-4 text-jz-blue-400" />
              {badge}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
