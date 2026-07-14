"use client";

import { useTranslation } from "react-i18next";

const SKYLINE_HEIGHTS = [40, 65, 90, 55, 100, 70, 45, 85, 60, 95, 50, 75, 40, 65, 88, 58, 100, 48];

export default function BuiltForAbuDhabi() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-jz-blue-900 py-14">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <h2 className="max-w-3xl font-serif text-2xl font-semibold text-jz-white-50 sm:text-3xl">{t("abuDhabi.heading")}</h2>
        <p className="mt-4 max-w-3xl text-jz-white-400">{t("abuDhabi.body")}</p>
      </div>

      <div aria-hidden="true" className="mt-10 flex h-28 items-end gap-1.5 px-4 opacity-60 sm:px-6 lg:px-10">
        {SKYLINE_HEIGHTS.map((h, i) => (
          <div
            key={i}
            className="w-4 rounded-t-sm bg-gradient-to-t from-jz-blue-500 to-jz-blue-200 sm:w-6"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </section>
  );
}
