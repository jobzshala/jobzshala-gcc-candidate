"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import SectionHeading from "./ui/SectionHeading";
import { splitHighlight } from "@/lib/utils";

export default function WorkforceAvailability() {
  const { t } = useTranslation();
  const [bodyBefore, bodyBold, bodyAfter] = splitHighlight(
    t("workforceAvailability.cardBody"),
    "UAE, Saudi Arabia, Qatar, Oman, Kuwait and Bahrain"
  );

  return (
    <section className="bg-jz-blue-950 py-14">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <SectionHeading heading={t("workforceAvailability.heading")} highlight={t("workforceAvailability.headingHighlight")} />

        <div className="mt-8 flex flex-col overflow-hidden rounded-2xl border border-jz-grey-400 bg-jz-blue-800 lg:h-[406px] lg:flex-row">
          <div className="relative aspect-[16/10] w-full shrink-0 lg:aspect-auto lg:h-full lg:w-[45%]">
            <Image
              src="/images/gcc-availability-map.jpg"
              alt={t("workforceAvailability.heading")}
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col justify-center p-6 sm:p-10">
            <h3 className="font-serif text-2xl font-semibold text-jz-white-50 sm:text-3xl">{t("workforceAvailability.cardTitle")}</h3>
            <p className="mt-5 text-base text-jz-white-200 sm:text-lg">
              {bodyBefore}
              {bodyBold && <span className="font-bold text-jz-white-50">{bodyBold}</span>}
              {bodyAfter}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
