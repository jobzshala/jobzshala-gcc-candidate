"use client";

import { useTranslation } from "react-i18next";
import SectionHeading from "./ui/SectionHeading";
import MapPanel from "./ui/MapPanel";

export default function WorkforceAvailability() {
  const { t } = useTranslation();

  return (
    <section className="bg-jz-blue-950 py-14">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <SectionHeading heading={t("workforceAvailability.heading")} highlight={t("workforceAvailability.headingHighlight")} />

        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-center">
          <MapPanel className="aspect-[16/10] w-full order-2 lg:order-1" />
          <div className="order-1 rounded-2xl border border-jz-grey-400 bg-jz-bg-primary p-6 lg:order-2">
            <h3 className="font-serif text-xl font-semibold text-jz-white-50">{t("workforceAvailability.cardTitle")}</h3>
            <p className="mt-4 text-jz-white-400">{t("workforceAvailability.cardBody")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
