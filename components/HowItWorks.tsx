"use client";

import { useTranslation } from "react-i18next";

type Step = { label: string; desc: string };

// Index-matched to howItWorks.steps.
const STEP_META: { img: string; color: string }[] = [
  { img: "/images/works/Requirment.webp", color: "#008DD2" },
  { img: "/images/works/Souring.webp", color: "#E64E4E" },
  { img: "/images/works/Interview.webp", color: "#32A37D" },
  { img: "/images/works/Offer_img.webp", color: "#4423CC" },
  { img: "/images/works/Visa.webp", color: "#EE8F11" },
  { img: "/images/works/Joining.webp", color: "#2AADCF" },
];

export default function HowItWorks() {
  const { t } = useTranslation();
  const steps = t("howItWorks.steps", { returnObjects: true }) as Step[];

  return (
    <section id="how-it-works" className="scroll-mt-24 bg-[#F6F9FA] py-10 font-poppins">
      <div className="mx-auto max-w-300 px-4 sm:px-0">
        <div className="text-left sm:text-center">
          <p className="text-lg font-medium leading-7.5 tracking-[0.01em] text-[#1A1A1A] sm:text-2xl">
            {t("howItWorks.eyebrow")}
          </p>
          <h2 className="mt-2 max-w-3xl text-2xl font-semibold leading-tight tracking-[0.01em] text-[#1A1A1A] sm:mx-auto sm:text-3xl">
            {t("howItWorks.headingLine1")}
            <br className="sm:hidden" />{" "}
            {t("howItWorks.headingLine2")}
            <br className="sm:hidden" />{" "}
            {t("howItWorks.headingLine3")}
            <br />
            <span className="text-[#008DD2]">
              {t("howItWorks.headingLine4")}
              <br className="sm:hidden" />{" "}
              {t("howItWorks.headingLine5")}
            </span>
          </h2>
          <p className="mt-4 max-w-3xl text-base font-normal leading-6.5 tracking-[0.01em] text-[#4A4A4A] sm:mx-auto">
            {t("howItWorks.subtitle")}
          </p>
        </div>

        <div className="mt-8 rounded-[20px] border border-[#008DD233] bg-[#EEF3FF] px-6 py-6 sm:px-8.5">
          <div className="flex flex-col items-stretch gap-6 lg:flex-row lg:items-start lg:gap-6 xl:justify-between xl:gap-x-4">
            {steps.map((step, i) => {
              const { img, color } = STEP_META[i] ?? STEP_META[0];
              return (
                <div
                  key={step.label}
                  className="flex items-center gap-4 text-left lg:flex-1 lg:flex-col lg:items-center lg:gap-5 lg:text-center xl:flex-none"
                >
                  <span className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0px_4px_8px_0px_#0000001A]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="size-9 object-contain" />
                  </span>
                  <div className="flex flex-col gap-1 lg:items-center">
                    <span
                      className="whitespace-nowrap text-base font-semibold uppercase leading-none tracking-[0.01em] lg:whitespace-normal lg:text-lg xl:whitespace-nowrap"
                      style={{ color }}
                    >
                      {step.label}
                    </span>
                    <span className="max-w-44 text-sm font-medium leading-5 tracking-[0.01em] text-[#4A4A4A] lg:max-w-42">
                      {step.desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
