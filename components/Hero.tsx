"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import Button from "./ui/Button";
import { SparkleIcon } from "./ui/icons";

export default function Hero() {
  const { t } = useTranslation();
  const badges = t("hero.badges", { returnObjects: true }) as string[];

  return (
    <section className="relative overflow-hidden bg-jz-blue-950">
      <div className="mx-auto max-w-[1440px] px-4 pt-10 pb-8 sm:px-6 lg:px-10 lg:pt-16 lg:pb-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div>
            <h1 className="font-serif text-4xl font-semibold leading-tight text-jz-white-50 sm:text-5xl">
              {t("hero.title")}
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

          <div className="relative aspect-[1038/519] w-full overflow-hidden rounded-2xl">
            <Image
              src="/images/hero-banner.jpg"
              alt={t("hero.imageAlt")}
              fill
              preload
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-jz-white-800">
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
