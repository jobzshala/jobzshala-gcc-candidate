"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import Button from "./ui/Button";

export default function CtaCards() {
  const { t } = useTranslation();

  return (
    <section className="bg-jz-blue-950 py-14">
      <div className="mx-auto grid max-w-[1440px] gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-10">
        <div className="relative flex flex-col justify-center gap-3 overflow-hidden rounded-3xl bg-jz-blue-400 p-6 sm:p-7">
          <div className="relative z-10 flex max-w-[78%] flex-col gap-3 sm:max-w-[68%]">
            <h3 className="font-serif text-2xl font-bold text-jz-grey-800 sm:whitespace-nowrap">{t("cta.hire.title")}</h3>
            <p className="text-sm leading-6 text-jz-grey-900">{t("cta.hire.body")}</p>
            <Button variant="primary" href="/hire/login" showIcon={false} className="mt-1 self-start">
              {t("cta.hire.button")}
            </Button>
          </div>
          {/* From sm up the box is taller than the card so the figure scales up
              and its lower body is cropped by the card edge, per the design. On
              mobile it stays inside the card, bottom-anchored, so the narrower
              stacked card doesn't leave the figure floating. */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[30%] sm:-right-[3%] sm:bottom-auto sm:h-[134%] sm:w-[36%]">
            <Image
              src="/images/businessman-tablet.jpg"
              alt=""
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 18vw, 30vw"
              className="scale-x-[-1] object-contain object-bottom sm:object-top"
            />
          </div>
        </div>

        <div className="relative flex flex-col justify-center gap-3 overflow-hidden rounded-3xl bg-jz-yellow-500 p-6 sm:p-7">
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
          {/* From sm up the box overhangs the card's right edge so the figure
              scales up and is cropped there, per the design. Kept inside the
              card on mobile, where the stacked card is too narrow for it. */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[34%] sm:-right-[13%] sm:w-[56%]">
            <Image
              src="/images/gcc-worker-portrait.png"
              alt=""
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 26vw, 34vw"
              className="object-contain object-bottom"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
