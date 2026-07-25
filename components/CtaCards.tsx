"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import Button from "./ui/Button";

export default function CtaCards() {
  const { t } = useTranslation();

  return (
    <section className="bg-jz-blue-950 py-14">
      <div className="mx-auto grid max-w-[1440px] gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-10">
        <div className="relative flex flex-col justify-center gap-3 overflow-hidden rounded-3xl border border-jz-grey-400 bg-jz-blue-400 p-6 sm:p-7">
          <div className="relative z-10 flex max-w-[78%] flex-col gap-3 sm:max-w-[68%]">
            <h3 className="font-serif text-2xl font-bold text-jz-grey-800 sm:whitespace-nowrap">{t("cta.hire.title")}</h3>
            <p className="text-sm leading-6 text-jz-grey-900">{t("cta.hire.body")}</p>
            <Button variant="primary" href="/hire/login" showIcon={false} className="mt-1 self-start">
              {t("cta.hire.button")}
            </Button>
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[26%] sm:w-[22%]">
            <Image
              src="/images/businessman-tablet.jpg"
              alt=""
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 12vw, 26vw"
              className="scale-x-[-1] object-contain object-bottom"
            />
          </div>
        </div>

        <div className="relative flex flex-col justify-center gap-3 overflow-hidden rounded-3xl border border-jz-grey-400 bg-jz-yellow-500 p-6 sm:p-7">
          <div className="relative z-10 flex max-w-[78%] flex-col gap-3 sm:max-w-[68%]">
            <h3 className="font-serif text-2xl font-bold text-jz-grey-800 sm:whitespace-nowrap">{t("cta.findWork.title")}</h3>
            <p className="text-sm leading-6 text-jz-grey-900">{t("cta.findWork.body")}</p>
            <a
              href="/register"
              className="mt-1 inline-flex items-center justify-center gap-1.5 self-start rounded-xl border border-jz-grey-900 px-4 py-2 text-sm font-bold whitespace-nowrap text-jz-grey-900 transition-opacity hover:opacity-90"
            >
              {t("cta.findWork.button")}
            </a>
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[30%] sm:w-[26%]">
            <Image
              src="/images/gcc-worker-portrait.png"
              alt=""
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 14vw, 30vw"
              className="object-contain object-bottom"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
