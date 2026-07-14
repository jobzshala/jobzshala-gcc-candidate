"use client";

import { useTranslation } from "react-i18next";
import SectionHeading from "./ui/SectionHeading";
import MapPanel from "./ui/MapPanel";

export default function WorkforceCorridor() {
  const { t } = useTranslation();

  return (
    <section className="bg-jz-blue-950 py-14">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <SectionHeading heading={t("corridor.heading")} highlight={t("corridor.headingHighlight")} />

        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-center">
          <div className="rounded-2xl border border-jz-grey-400 bg-jz-bg-primary p-6">
            <h3 className="font-serif text-xl font-semibold text-jz-white-50">{t("corridor.title")}</h3>
            <p className="mt-4 text-jz-white-400">{t("corridor.body")}</p>
          </div>
          <MapPanel className="aspect-[16/10] w-full" />
        </div>
      </div>
    </section>
  );
}
