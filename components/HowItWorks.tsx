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
    <section id="how-it-works" className="scroll-mt-24 bg-white py-10 font-poppins">
      <div className="mx-auto max-w-300 ">
        <div className="text-center">
          <p className="text-lg font-medium leading-7.5 tracking-[0.01em] text-[#1A1A1A] sm:text-2xl">
            {t("howItWorks.eyebrow")}
          </p>
          <h2 className="mx-auto mt-2 max-w-3xl text-2xl font-semibold leading-tight tracking-[0.01em] text-[#1A1A1A] sm:text-3xl md:text-4xl md:leading-11.5">
            {t("howItWorks.headingLine1")}
            <br />
            <span className="text-[#008DD2]">{t("howItWorks.headingLine2")}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base font-normal leading-6.5 tracking-[0.01em] text-[#4A4A4A]">
            {t("howItWorks.subtitle")}
          </p>
        </div>

        <div className="mt-8 rounded-[20px] border border-[#008DD233] bg-[#EEF3FF] px-6 py-6 sm:px-8.5">
          <div className="flex flex-col items-stretch gap-6 lg:flex-row lg:items-start lg:gap-12">
            {steps.map((step, i) => {
              const { img, color } = STEP_META[i] ?? STEP_META[0];
              return (
                <div
                  key={step.label}
                  className="flex flex-col items-center gap-5 text-center lg:flex-1 lg:max-w-40"
                >
                  <span className="flex size-20 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="size-9 object-contain" />
                  </span>
                  <div className="flex flex-col items-center gap-1">
                    <span
                      className="text-xl font-semibold uppercase leading-none tracking-[0.01em]"
                      style={{ color }}
                    >
                      {step.label}
                    </span>
                    <span className="text-sm font-medium leading-5 tracking-[0.01em] text-[#4A4A4A]">
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
