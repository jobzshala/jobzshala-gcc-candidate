"use client";

import { useTranslation } from "react-i18next";

type Feature = { label: string; desc: string };

// Index-matched to builtForEmployers.features.
const FEATURE_META: { img: string; color: string }[] = [
  { img: "/images/Employer/Direct.svg", color: "#008DD2" },
  { img: "/images/Employer/Live.svg", color: "#32A37D" },
  { img: "/images/Employer/Better.svg", color: "#4423CC" },
  { img: "/images/Employer/faster.svg", color: "#EE8F11" },
];

export default function BuiltForEmployers() {
  const { t } = useTranslation();
  const features = t("builtForEmployers.features", {
    returnObjects: true,
  }) as Feature[];

  return (
    <section
      id="built-for-employers"
      className="scroll-mt-24 bg-[#FFFEFE] py-10 font-poppins sm:py-20"
    >
      <div className="mx-auto max-w-300 px-4 sm:px-0">
        <div className="flex flex-col gap-7">
          <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 text-left sm:items-center sm:text-center">
            <p className="text-lg font-medium leading-7.5 tracking-[0.01em] text-[#1A1A1A] sm:text-2xl">
              {t("builtForEmployers.eyebrow")}
            </p>
            <h2 className="text-2xl font-semibold leading-snug tracking-[0.01em] text-balance text-[#1A1A1A] sm:text-3xl md:text-4xl md:leading-11.5">
              {t("builtForEmployers.headingLine1")}{" "}
              <span className="text-[#008DD2]">
                {t("builtForEmployers.headingHighlight")}
              </span>
            </h2>
            <p className="text-base font-normal leading-6.5 tracking-[0.01em] text-[#4A4A4A]">
              {t("builtForEmployers.subtitle")}
            </p>
          </div>

          <div className="rounded-[20px] border border-[#008DD233] bg-[#EEF3FF] px-6 py-8 sm:px-8.5 sm:py-10">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {features.map((feature, i) => {
                const { img, color } = FEATURE_META[i] ?? FEATURE_META[0];
                return (
                  <div
                    key={feature.label}
                    className="flex items-center gap-4 text-left sm:flex-col sm:items-center sm:gap-5 sm:text-center"
                  >
                    <span className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0px_4px_8px_0px_#0000001A]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="size-9 object-contain" />
                    </span>
                    <div className="flex flex-col gap-1 sm:items-center">
                      <span
                        className="text-xl font-semibold leading-none tracking-[0.01em]"
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
