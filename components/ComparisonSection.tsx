"use client";

import { useTranslation } from "react-i18next";
import SectionHeading from "./ui/SectionHeading";
import { CrossIcon, TickIcon } from "./ui/icons";

type ComparisonSide = { title: string; items: string[] };

export default function ComparisonSection() {
  const { t } = useTranslation();
  const traditional = t("comparison.traditional", { returnObjects: true }) as ComparisonSide;
  const jobzshala = t("comparison.jobzshala", { returnObjects: true }) as ComparisonSide;

  return (
    <section className="bg-jz-blue-950 py-14">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <SectionHeading heading={t("comparison.heading")} highlight={t("comparison.headingHighlight")} align="center" />

        <div className="relative mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-jz-grey-400 bg-jz-bg-primary p-6">
            <h3 className="font-serif text-lg font-bold text-jz-white-50">{traditional.title}</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {traditional.items.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-jz-white-200">
                  <CrossIcon className="size-5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 z-10 hidden size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-jz-yellow-400 bg-jz-blue-950 font-serif text-sm font-semibold text-jz-yellow-400 lg:flex"
          >
            {t("comparison.vs")}
          </div>

          <div className="rounded-2xl border border-jz-yellow-400 bg-jz-bg-primary p-6">
            <h3 className="font-serif text-lg font-bold text-jz-yellow-400">{jobzshala.title}</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {jobzshala.items.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-jz-white-200">
                  <TickIcon className="size-5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
