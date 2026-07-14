"use client";

import { useTranslation } from "react-i18next";
import SectionHeading from "./ui/SectionHeading";

export default function HowItWorks() {
  const { t } = useTranslation();
  const steps = t("howItWorks.steps", { returnObjects: true }) as string[];

  return (
    <section className="bg-jz-blue-950 py-14">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <SectionHeading heading={t("howItWorks.heading")} highlight={t("howItWorks.headingHighlight")} align="center" />

        <div className="mt-12 flex snap-x gap-6 overflow-x-auto pb-4 lg:grid lg:grid-cols-7 lg:overflow-visible">
          {steps.map((step, i) => (
            <div key={step} className="flex w-40 shrink-0 snap-start flex-col items-center gap-3 text-center lg:w-auto">
              <div className="flex size-12 items-center justify-center rounded-full border border-jz-yellow-400 font-serif text-lg font-semibold text-jz-yellow-400">
                {i + 1}
              </div>
              <p className="text-sm text-jz-white-200">{step}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-jz-white-600">{t("howItWorks.footnote")}</p>
      </div>
    </section>
  );
}
