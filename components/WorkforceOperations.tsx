"use client";

import { useTranslation } from "react-i18next";

type Feature = { label: string; desc: string };

// Index-matched to workforceOps.features.
const FEATURE_META: { img: string; color: string }[] = [
  { img: "/images/Workforce/Real-Time.svg", color: "#008DD2" },
  { img: "/images/Workforce/Tracking.svg", color: "#E64E4E" },
  { img: "/images/Workforce/qualiy.svg", color: "#32A37D" },
  { img: "/images/Workforce/Smarter.svg", color: "#4423CC" },
  { img: "/images/Workforce/Proactive.svg", color: "#EE8F11" },
  { img: "/images/Workforce/Multi-Resion.svg", color: "#2AADCF" },
];

export default function WorkforceOperations() {
  const { t } = useTranslation();
  const features = t("workforceOps.features", {
    returnObjects: true,
  }) as Feature[];

  return (
    <section
      id="workforce-operations"
      className="scroll-mt-24 bg-white py-10 font-poppins sm:py-20"
    >
      <div className="mx-auto max-w-300">
        <div className="flex flex-col gap-8 py-8 sm:py-10">
          <div className="grid items-center gap-8 lg:grid-cols-[467px_1fr] lg:gap-[157px]">
            {/* Left Content */}
            <div className="flex flex-col gap-5">
              <p className="text-lg font-medium leading-7.5 tracking-[0.01em] text-[#1A1A1A] sm:text-2xl">
                {t("workforceOps.eyebrow")}
              </p>

              <h2 className="text-2xl font-semibold leading-snug tracking-[0.01em] text-[#1A1A1A] sm:text-3xl">
                {t("workforceOps.headingLine1")}
                <br />
                {t("workforceOps.headingLine2")}{" "}
                <span className="text-[#008DD2]">
                  {t("workforceOps.headingHighlight")}
                </span>
              </h2>

              <p className="leading-6.5 tracking-[0.01em] text-[#4A4A4A]">
                {t("workforceOps.body")}
              </p>
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/Workforce/workforce.svg"
              alt={t("workforceOps.imageAlt")}
              width={553}
              height={355}
              className="h-auto w-full lg:max-w-[553px]"
            />
          </div>

          <div className="rounded-[20px] border border-[#008DD233] bg-[#EEF3FF] px-6 py-8 sm:px-8.5 sm:py-10">
            <div className="flex flex-col items-stretch gap-6 lg:flex-row lg:items-start lg:gap-12">
              {features.map((feature, i) => {
                const { img, color } = FEATURE_META[i] ?? FEATURE_META[0];
                return (
                  <div
                    key={feature.label}
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
                        {feature.label}
                      </span>
                      <span className="text-sm font-medium leading-5 tracking-[0.01em] text-[#4A4A4A]">
                        {feature.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
