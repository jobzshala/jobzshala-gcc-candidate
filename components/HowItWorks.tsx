"use client";

import { useTranslation } from "react-i18next";
import SectionHeading from "./ui/SectionHeading";
import {
  ArrowRightIcon,
  BriefcaseIcon,
  SparkleIcon,
  SearchIcon,
  TargetIcon,
  DocumentIcon,
  GlobeIcon,
  TickIcon,
} from "./ui/icons";

const STEP_ICONS = [BriefcaseIcon, SparkleIcon, SearchIcon, TargetIcon, DocumentIcon, GlobeIcon, TickIcon];

export default function HowItWorks() {
  const { t } = useTranslation();
  const steps = t("howItWorks.steps", { returnObjects: true }) as string[];

  return (
    <section className="bg-jz-blue-950 py-14 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <SectionHeading heading={t("howItWorks.heading")} highlight={t("howItWorks.headingHighlight")} align="center" />

        <div className="mt-12 flex snap-x items-center gap-2 overflow-x-auto pb-4 lg:overflow-visible">
          {steps.map((step, i) => {
            const StepIcon = STEP_ICONS[i % STEP_ICONS.length];
            return (
              <div key={step} className="flex min-w-0 shrink-0 items-center gap-1 lg:flex-1">
                <div className="flex w-36 min-w-0 shrink-0 snap-start flex-col items-center gap-3 rounded-xl border border-jz-grey-400 bg-gradient-to-t from-jz-bg-primary to-jz-blue-900 px-3 pt-6 pb-5 text-center transition-colors hover:border-jz-blue-400 lg:w-auto lg:min-w-0 lg:flex-1">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-jz-blue-400 to-jz-blue-800 text-xs font-medium text-jz-white-50">
                    {i + 1}
                  </span>
                  <StepIcon className="size-9 shrink-0 text-jz-blue-400" />
                  <p className="text-sm text-jz-white-50">{step}</p>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRightIcon className="size-5 shrink-0 text-jz-yellow-400 max-lg:hidden" />
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-center text-sm text-jz-white-600">{t("howItWorks.footnote")}</p>
      </div>
    </section>
  );
}
