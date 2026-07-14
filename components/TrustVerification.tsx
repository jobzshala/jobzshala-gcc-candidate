"use client";

import { useTranslation } from "react-i18next";
import { ShieldCheckIcon } from "./ui/icons";

export default function TrustVerification() {
  const { t } = useTranslation();

  return (
    <section className="bg-jz-blue-900 py-14">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-8 px-4 sm:px-6 lg:flex-row lg:px-10">
        <ShieldCheckIcon className="size-24 shrink-0 lg:size-32" />
        <div className="text-center lg:text-left rtl:lg:text-right">
          <h2 className="font-serif text-2xl font-semibold text-jz-white-50 sm:text-3xl">{t("trustVerification.title")}</h2>
          <p className="mt-4 max-w-3xl text-jz-white-200">
            {t("trustVerification.bodyPrefix")}
            <span className="font-semibold text-jz-white-50">{t("trustVerification.bodyBold")}</span>
            {t("trustVerification.bodySuffix")}
          </p>
        </div>
      </div>
    </section>
  );
}
