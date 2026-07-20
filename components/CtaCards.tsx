"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import Button from "./ui/Button";
import { ArrowRightIcon } from "./ui/icons";

export default function CtaCards() {
  const { t } = useTranslation();

  return (
    <section className="bg-jz-blue-950 py-14">
      <div className="mx-auto grid max-w-[1440px] gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-10">
        <div className="flex flex-col justify-center gap-4 rounded-2xl border border-jz-grey-400 bg-jz-blue-400 p-8 sm:p-10">
          <h3 className="font-serif text-2xl font-bold text-jz-grey-800">{t("cta.hire.title")}</h3>
          <p className="text-jz-grey-900">{t("cta.hire.body")}</p>
          <Button variant="primary" href="/hire/login" className="mt-2 self-start">
            {t("cta.hire.button")}
          </Button>
        </div>

        <div className="relative flex flex-col justify-center gap-4 overflow-hidden rounded-2xl border border-jz-grey-400 bg-jz-yellow-500 p-8 sm:p-10">
          <div className="relative z-10 flex max-w-[65%] flex-col gap-4 sm:max-w-[55%]">
            <h3 className="font-serif text-2xl font-bold text-jz-grey-800">{t("cta.findWork.title")}</h3>
            <p className="text-jz-grey-900">{t("cta.findWork.body")}</p>
            <a
              href="/register"
              className="mt-2 inline-flex items-center justify-center gap-1.5 self-start rounded-xl border border-jz-grey-900 px-4 py-2 text-sm font-bold whitespace-nowrap text-jz-grey-900 transition-opacity hover:opacity-90"
            >
              {t("cta.findWork.button")}
              <ArrowRightIcon className="size-5 shrink-0" />
            </a>
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[45%] sm:w-[40%]">
            <Image
              src="/images/gcc-worker-portrait.png"
              alt=""
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 20vw, 40vw"
              className="object-contain object-bottom"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
