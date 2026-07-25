"use client";

import { useTranslation } from "react-i18next";
import SectionHeading from "./ui/SectionHeading";
import { SparkleIcon } from "./ui/icons";

export default function PlatformFeatures() {
  const { t } = useTranslation();
  const features = t("platformFeatures.features", { returnObjects: true }) as string[];

  return (
    <section className="bg-jz-blue-950 py-14">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <SectionHeading heading={t("platformFeatures.heading")} highlight={t("platformFeatures.headingHighlight")} />

        <div className="mt-7 rounded-3xl border border-jz-grey-400 bg-gradient-to-r from-jz-bg-primary to-jz-blue-900 p-6 sm:p-8">
          <div className="flex flex-wrap gap-3">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2 rounded-2xl border border-jz-grey-400 bg-jz-bg-primary px-4 py-2.5 text-sm text-jz-white-50"
              >
                <SparkleIcon className="size-4 text-jz-blue-400" />
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
