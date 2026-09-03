"use client";

import { useTranslation } from "react-i18next";

type Feature = { label: string; desc: string };

// Index-matched to ourVision.features.
const FEATURE_META: { img: string; color: string }[] = [
  { img: "/images/Vision/Ai-Native.svg", color: "#008DD2" },
  { img: "/images/Vision/Cross.svg", color: "#32A37D" },
  { img: "/images/Vision/workforce.svg", color: "#4423CC" },
  { img: "/images/Vision/Enter_price.svg", color: "#EE8F11" },
];

export default function OurVision() {
  const { t } = useTranslation();
  const features = t("ourVision.features", { returnObjects: true }) as Feature[];

  return (
    <section
      id="our-vision"
      className="scroll-mt-24 bg-[#F6F9FA] py-10 font-poppins sm:py-20"
    >
      <div className="mx-auto max-w-300">
        <div className="flex flex-col gap-8">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <p className="text-lg font-medium leading-7.5 tracking-[0.01em] text-[#1A1A1A] sm:text-2xl">
              {t("ourVision.eyebrow")}
            </p>
            <h2 className="text-2xl font-semibold leading-snug tracking-[0.01em] text-[#008DD2] sm:text-3xl md:text-4xl md:leading-11.5">
              {t("ourVision.heading")}
            </h2>
            <p className="text-base font-normal leading-6.5 tracking-[0.01em] text-[#4A4A4A]">
              {t("ourVision.subtitle")}
            </p>
          </div>

          {/* Image block with overlaid copy */}
          <div className="relative overflow-hidden rounded-[20px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/Vision/Vision_img.svg"
              alt={t("ourVision.imageAlt")}
              width={1240}
              height={560}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-transparent" />
            <div className="absolute left-0 top-0 flex max-w-[567px] flex-col gap-3 p-6 sm:p-10">
              <p className="text-lg font-medium leading-tight tracking-[0.01em] text-white sm:text-xl">
                {t("ourVision.imageBody")}
              </p>
              <p className="text-base font-semibold leading-none tracking-[0.01em] text-[#FECC00]">
                {t("ourVision.imageTag")}
              </p>
            </div>
          </div>

          {/* Feature panel */}
          <div className="rounded-[20px] border border-[#008DD233] bg-[#EEF3FF] px-6 py-8 sm:px-8.5 sm:py-10">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))] lg:gap-4">
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
                        className="whitespace-nowrap text-lg font-semibold uppercase leading-none tracking-[0.01em]"
                        style={{ color }}
                      >
                        {feature.label}
                      </span>
                      <span className="max-w-44 text-sm font-medium leading-5 tracking-[0.01em] text-[#4A4A4A]">
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
