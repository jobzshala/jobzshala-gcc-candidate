"use client";

import { useTranslation } from "react-i18next";
import SectionHeading from "./ui/SectionHeading";
import CorridorVisual from "./ui/CorridorVisual";

export default function WorkforceCorridor() {
  const { t } = useTranslation();

  return (
    <section className="bg-jz-blue-950 py-14">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <SectionHeading heading={t("corridor.heading")} highlight={t("corridor.headingHighlight")} />

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h3 className="font-serif text-2xl font-semibold text-jz-white-50 sm:text-3xl">{t("corridor.title")}</h3>
            <p className="mt-4 max-w-xl text-jz-white-200">{t("corridor.body")}</p>
          </div>
          <CorridorVisual className="aspect-square w-full max-w-md justify-self-center lg:max-w-none" />
        </div>
      </div>
    </section>
  );
}
