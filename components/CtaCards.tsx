"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import Button from "./ui/Button";

export default function CtaCards() {
  const { t } = useTranslation();

  return (
    <section className="bg-jz-blue-950 py-14">
      <div className="mx-auto grid max-w-[1440px] gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-10">
        <div className="flex flex-col justify-center gap-4 rounded-2xl bg-jz-blue-800 p-8">
          <h3 className="font-serif text-2xl font-semibold text-jz-white-50">{t("cta.hire.title")}</h3>
          <p className="text-jz-white-200">{t("cta.hire.body")}</p>
          <Button variant="primary" href="/employer/login" className="mt-2 self-start">
            {t("cta.hire.button")}
          </Button>
        </div>

        <div className="relative flex flex-col justify-center gap-4 overflow-hidden rounded-2xl p-8">
          <Image
            src="/images/construction-worker.jpg"
            alt=""
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-jz-blue-950/70" />
          <div className="relative z-10 flex flex-col gap-4">
            <h3 className="font-serif text-2xl font-semibold text-jz-white-50">{t("cta.findWork.title")}</h3>
            <p className="text-jz-white-200">{t("cta.findWork.body")}</p>
            <Button variant="primary" href="/register" className="mt-2 self-start">
              {t("cta.findWork.button")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
