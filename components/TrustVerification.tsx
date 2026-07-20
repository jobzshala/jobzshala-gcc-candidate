"use client";

import { useTranslation } from "react-i18next";
import { ShieldCheckIcon } from "./ui/icons";

export default function TrustVerification() {
  const { t } = useTranslation();

  return (
    <section className="bg-jz-blue-950 py-14">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col items-center gap-8 rounded-2xl border border-jz-grey-400 bg-gradient-to-r from-jz-bg-primary to-jz-blue-900 p-8 sm:p-10 lg:flex-row rtl:lg:flex-row-reverse">
          <div className="flex size-24 shrink-0 items-center justify-center rounded-full bg-jz-green-500/10 lg:size-32">
            <ShieldCheckIcon className="size-14 lg:size-20" />
          </div>
          <div className="text-center lg:text-left rtl:lg:text-right">
            <h2 className="font-serif text-2xl font-semibold text-jz-white-50 sm:text-3xl">{t("trustVerification.title")}</h2>
            <p className="mt-4 max-w-3xl text-jz-white-200">
              {t("trustVerification.bodyPrefix")}
              <span className="font-semibold text-jz-white-50">{t("trustVerification.bodyBold")}</span>
              {t("trustVerification.bodySuffix")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
