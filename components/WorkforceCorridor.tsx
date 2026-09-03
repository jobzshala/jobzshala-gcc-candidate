"use client";

import { useTranslation } from "react-i18next";

type Feature = { label: string; desc: string };

// Index-matched to workforceCorridor.features.
const FEATURE_META: { img: string; color: string }[] = [
  { img: "/images/Corridor/Acess.svg", color: "#008DD2" },
  { img: "/images/Corridor/Fster.svg", color: "#32A37D" },
  { img: "/images/Corridor/Quality.svg", color: "#4423CC" },
  { img: "/images/Corridor/Patner.svg", color: "#EE8F11" },
];

export default function WorkforceCorridor() {
  const { t } = useTranslation();
  const features = t("workforceCorridor.features", {
    returnObjects: true,
  }) as Feature[];

  return (
    <section
      id="workforce-infrastructure"
      className="scroll-mt-24 bg-[#F6F9FA] py-10 font-poppins sm:py-20"
    >
      <div className="mx-auto max-w-300">
        <div className="flex flex-col gap-8 py-8 sm:py-10">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            {/* Left Content */}
            <div className="flex flex-col gap-5">
              <p className="text-lg font-medium leading-7.5 tracking-[0.01em] text-[#1A1A1A] sm:text-2xl">
                {t("workforceCorridor.eyebrow")}
              </p>

              <h2 className="text-2xl font-semibold leading-snug tracking-[0.01em] text-[#1A1A1A] sm:text-3xl md:text-4xl md:leading-11.5">
                {t("workforceCorridor.headingLine1")}
                <br />
                {t("workforceCorridor.headingLine2")}
                <br />
                <span className="text-[#008DD2]">
                  {t("workforceCorridor.headingHighlight")}
                </span>
              </h2>

              <p className="text-base font-normal leading-6.5 tracking-[0.01em] text-[#4A4A4A]">
                {t("workforceCorridor.body")}
              </p>
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/Corridor/corridor.svg"
              alt={t("workforceCorridor.imageAlt")}
              width={586}
              height={355}
              className="w-full object-contain lg:h-[355px]"
            />
          </div>

          <div className="rounded-[20px] border border-[#008DD233] bg-[#EEF3FF] px-6 py-8 sm:px-8.5 sm:py-10">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {features.map((feature, i) => {
                const { img, color } = FEATURE_META[i] ?? FEATURE_META[0];
                return (
                  <div
                    key={feature.label}
                    className="flex flex-col items-center gap-5 text-center"
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
