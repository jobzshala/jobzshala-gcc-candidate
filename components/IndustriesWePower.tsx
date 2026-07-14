"use client";

import { useTranslation } from "react-i18next";
import SectionHeading from "./ui/SectionHeading";

export default function IndustriesWePower() {
  const { t } = useTranslation();
  const industries = t("industries.list", { returnObjects: true }) as string[];

  return (
    <section className="bg-jz-blue-950 py-14">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <SectionHeading heading={t("industries.heading")} highlight={t("industries.headingHighlight")} />

        <div className="mt-8 flex flex-wrap gap-3">
          {industries.map((industry) => (
            <span
              key={industry}
              className="flex items-center gap-2 rounded-2xl border border-jz-grey-400 bg-jz-bg-primary px-4 py-2.5 text-sm text-jz-white-50"
            >
              <span aria-hidden="true" className="size-1.5 rounded-full bg-jz-yellow-400" />
              {industry}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
