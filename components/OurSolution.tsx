"use client";

import { Fragment } from "react";
import { useTranslation } from "react-i18next";

type Step = { label: string; desc: string };
type Feature = { title: string; sub: string };

const STEP_META: { img: string; color: string }[] = [
  { img: "/images/works/Source.webp", color: "#008DD2" },
  { img: "/images/works/Screen_img.webp", color: "#E0533D" },
  { img: "/images/works/Verify.webp", color: "#2F9E5E" },
  { img: "/images/works/Match.webp", color: "#7B5CD6" },
  { img: "/images/works/Deploy.webp", color: "#E8912E" },
  { img: "/images/works/Track.webp", color: "#1FA8A0" },
];

const FEATURE_META: { img: string; color: string }[] = [
  { img: "/images/works/Ai_Power.webp", color: "#008DD2" },
  { img: "/images/works/Verified.webp", color: "#2F9E5E" },
  { img: "/images/works/End_to_End.webp", color: "#7B5CD6" },
  { img: "/images/works/Cross_border.webp", color: "#E8912E" },
];

export default function OurSolution() {
  const { t } = useTranslation();
  const steps = t("ourSolution.steps", { returnObjects: true }) as Step[];
  const features = t("ourSolution.features", { returnObjects: true }) as Feature[];

  return (
    <section id="recruitment-solutions" className="scroll-mt-24 bg-[#F6F9FA] py-10 font-poppins sm:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-0">
        <div className="grid items-center gap-10 lg:grid-cols-[434fr_766fr]">
          <div className="flex flex-col gap-5">
            <p className="text-lg font-medium leading-7.5 tracking-[0.01em] text-[#1A1A1A] sm:text-2xl">
              {t("ourSolution.eyebrow")}
            </p>
            <h2 className="text-2xl font-semibold leading-tight tracking-[0.01em] text-[#1A1A1A] sm:text-3xl md:text-4xl md:leading-11.5">
              {t("ourSolution.headingLine1")}
              <br />
              {t("ourSolution.headingLine2")}
              <br />
              <span className="text-[#008DD2]">{t("ourSolution.headingLine3")}</span>
              <br />
              <span className="text-[#008DD2]">{t("ourSolution.headingLine4")}</span>
            </h2>
            <p className="text-base font-normal leading-6.5 tracking-[0.01em] text-[#4A4A4A]">
              {t("ourSolution.subtitle")}
            </p>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/works/workforce-solution-mobile.webp"
            alt={t("ourSolution.imageAlt")}
            className="w-full rounded-[20px] border border-[#DFE6EA] bg-[#E8EBF5] object-contain sm:hidden"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/works/workforce-solution.webp"
            alt={t("ourSolution.imageAlt")}
            className="hidden h-86 w-full rounded-[20px] border border-[#DFE6EA] bg-[#E8EBF5] object-cover sm:block"
          />
        </div>

        <div className="mt-8 rounded-[20px] border border-[#008DD233] bg-[#EEF3FF] px-6 py-6 sm:px-8.5">
          <p className="text-center text-xl font-medium leading-none tracking-[0.01em] text-[#4A4A4A]">
            {t("ourSolution.panelTitle")}
          </p>

          <div className="relative mt-8 flex flex-col items-stretch gap-10 lg:flex-row lg:items-start lg:gap-6 xl:justify-between xl:gap-0">
            {/* Dashed connector at circle-center height (40px = half of
                size-20); the opaque white circles paint over it, leaving dashes
                only in the gaps. Horizontal on desktop, vertical on mobile. */}
            <span
              aria-hidden="true"
              className="absolute inset-x-[10%] top-10 hidden border-t-2 border-dashed border-[#9AA6B2] lg:block"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-10 left-10 top-10 border-l-2 border-dashed border-[#9AA6B2] lg:hidden"
            />

            {steps.map((step, i) => {
              const { img, color } = STEP_META[i] ?? STEP_META[0];
              return (
                <div
                  key={step.label}
                  className="relative z-10 flex items-center gap-4 text-left lg:flex-1 lg:flex-col lg:items-center lg:gap-5 lg:text-center xl:flex-none"
                >
                  <span className="relative z-10 flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0px_4px_8px_0px_#0000001A]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="size-9 object-contain" />
                  </span>
                  <div className="flex flex-col gap-1 lg:items-center">
                    <span
                      className="text-xl font-semibold uppercase leading-none tracking-[0.01em]"
                      style={{ color }}
                    >
                      {step.label}
                    </span>
                    <span className="max-w-40 text-sm font-medium leading-5 tracking-[0.01em] text-[#4A4A4A] lg:max-w-44">
                      {step.desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-10 rounded-[20px] bg-white pt-5 pr-19 pb-5 pl-8 shadow-[0px_4px_8px_0px_#0000001A] sm:grid sm:grid-cols-2 sm:gap-0 sm:rounded-2xl sm:border sm:border-[#DFE6EA] sm:p-0 sm:shadow-md lg:grid-cols-4">
          {features.map((f, i) => {
            const { img, color } = FEATURE_META[i] ?? FEATURE_META[0];
            return (
              <Fragment key={f.title}>
                {i > 0 && (
                  <span aria-hidden="true" className="h-px w-22 bg-[#DFE6EA] sm:hidden" />
                )}
                <div
                  className={`relative flex items-center gap-3 sm:px-7 sm:py-5 ${
                    i > 0
                      ? "lg:before:absolute lg:before:left-0 lg:before:top-1/2 lg:before:h-12 lg:before:w-px lg:before:-translate-y-1/2 lg:before:bg-[#DFE6EA] lg:before:content-['']"
                      : ""
                  }`}
                >
                  <span
                    className="flex size-18 shrink-0 items-center justify-center overflow-hidden rounded-lg"
                    style={{ backgroundColor: `${color}1A` }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="size-9 object-contain" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <p
                      className="text-xl font-semibold uppercase leading-none tracking-[0.01em]"
                      style={{ color }}
                    >
                      {f.title}
                    </p>
                    <p className="text-sm font-medium leading-5 tracking-[0.01em] text-[#4A4A4A]">
                      {f.sub}
                    </p>
                  </div>
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
