"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function OurVision() {
  const { t } = useTranslation();

  return (
    <section className="bg-jz-blue-950 py-14">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <h2 className="font-serif text-2xl font-semibold text-jz-white-50 sm:text-3xl">{t("vision.heading")}</h2>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <p className="text-jz-white-400 leading-relaxed">{t("vision.body")}</p>
          <div className="relative aspect-[340/279] w-full overflow-hidden rounded-2xl">
            <Image
              src="/images/businessman-tablet.jpg"
              alt={t("vision.heading")}
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
