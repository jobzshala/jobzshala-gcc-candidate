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
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10">
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
            src="/images/works/workforce-solution.png"
            alt={t("ourSolution.imageAlt")}
            className="h-86 w-full rounded-[20px] border border-[#DFE6EA] bg-[#E8EBF5] object-cover"
          />
        </div>

        <div className="mt-10 rounded-2xl border border-[#008DD233] bg-[#EEF3FF] p-6 sm:p-10">
          <p className="text-center text-xl font-medium leading-none tracking-[0.01em] text-[#4A4A4A]">
            {t("ourSolution.panelTitle")}
          </p>

          <div className="mt-8 flex flex-col items-stretch gap-6 lg:flex-row lg:items-start lg:gap-0">
            {steps.map((step, i) => {
              const { img, color } = STEP_META[i] ?? STEP_META[0];
              return (
                <Fragment key={step.label}>
                  {i > 0 && (
                    <div
                      aria-hidden="true"
                      className="hidden self-center border-t border-dashed border-[#4A4A4A] lg:mt-7 lg:block lg:flex-1"
                    />
                  )}
                  <div className="flex flex-col items-center gap-2 text-center lg:w-32 lg:shrink-0">
                    <span className="flex size-14 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="size-7 object-contain" />
                    </span>
                    <span
                      className="text-sm font-semibold uppercase tracking-wide"
                      style={{ color }}
                    >
                      {step.label}
                    </span>
                    <span className="text-xs leading-tight text-[#4A4A4A]">{step.desc}</span>
                  </div>
                </Fragment>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid overflow-hidden rounded-2xl border border-[#DFE6EA] bg-white shadow-md sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => {
            const { img, color } = FEATURE_META[i] ?? FEATURE_META[0];
            return (
              <div
                key={f.title}
                className={`relative flex items-center gap-3 px-7 py-5 ${
                  i > 0
                    ? "lg:before:absolute lg:before:left-0 lg:before:top-1/2 lg:before:h-12 lg:before:w-px lg:before:-translate-y-1/2 lg:before:bg-[#DFE6EA] lg:before:content-['']"
                    : ""
                }`}
              >
                <span
                  className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl"
                  style={{ backgroundColor: `${color}1A` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="size-6 object-contain" />
                </span>
                <div>
                  <p className="text-sm font-semibold" style={{ color }}>
                    {f.title}
                  </p>
                  <p className="text-xs text-[#4A4A4A]">{f.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
