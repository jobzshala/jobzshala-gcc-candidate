"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function OurVision() {
  const { t } = useTranslation();
  const title = t("vision.title", { defaultValue: "" });

  return (
    <section className="bg-jz-blue-950 py-14">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <h2 className="font-serif text-2xl font-semibold text-jz-white-50 sm:text-3xl">{t("vision.heading")}</h2>

        <div className="mt-7 grid gap-8 overflow-hidden rounded-3xl border border-jz-grey-400 bg-gradient-to-r from-jz-bg-primary to-jz-blue-900 p-6 sm:p-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            {title && (
              <p className="font-serif text-xl font-bold text-jz-white-50 sm:text-2xl">{title}</p>
            )}
            <p className="mt-4 text-jz-white-200 leading-relaxed">{t("vision.body")}</p>
          </div>
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
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
