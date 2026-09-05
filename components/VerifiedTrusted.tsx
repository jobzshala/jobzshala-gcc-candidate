"use client";

import { useTranslation } from "react-i18next";
import { CheckCircleIcon } from "./ui/icons";

type Step = { label: string; desc: string };

// Index-matched to verifiedTrusted.steps.
const STEP_META: { img: string; color: string }[] = [
  { img: "/images/Verified/Identity.svg", color: "#008DD2" },
  { img: "/images/Verified/Validation.svg", color: "#32A37D" },
  { img: "/images/Verified/Exprience.svg", color: "#4423CC" },
  { img: "/images/Verified/Skill.svg", color: "#EE8F11" },
  { img: "/images/Verified/Employer.svg", color: "#E64E4E" },
];

export default function VerifiedTrusted() {
  const { t } = useTranslation();
  const points = t("verifiedTrusted.points", {
    returnObjects: true,
  }) as string[];
  const steps = t("verifiedTrusted.steps", { returnObjects: true }) as Step[];

  return (
    <section
      id="candidate-verification"
      className="scroll-mt-24 bg-[#F6F9FA] py-10 font-poppins sm:py-20"
    >
      <div className="mx-auto max-w-300 px-4 sm:px-0">
        <div className="flex flex-col gap-8">
          <div className="grid items-center  lg:grid-cols-2">
            {/* Left Content */}
            <div className="flex flex-col gap-4">
              <p className="text-lg font-medium leading-7.5 tracking-[0.01em] text-[#1A1A1A] sm:text-2xl">
                {t("verifiedTrusted.eyebrow")}
              </p>

              <h2 className="text-2xl font-semibold leading-snug tracking-[0.01em] text-[#1A1A1A] sm:text-3xl">
                {t("verifiedTrusted.headingLine1")}
                <br />
                {t("verifiedTrusted.headingLine2")}{" "}
                <span className="whitespace-nowrap text-[#008DD2]">
                  {t("verifiedTrusted.headingHighlight")}
                </span>
              </h2>

              <p className="  leading-6.5 tracking-[0.01em] text-[#4A4A4A] ">
                {t("verifiedTrusted.body")}
              </p>

              <p className="text-base font-semibold leading-6.5 tracking-[0.01em] text-[#1A1A1A]">
                {t("verifiedTrusted.emphasisMuted")}
                <br />
                <span className="text-[#008DD2]">
                  {t("verifiedTrusted.emphasisHighlight")}
                </span>
              </p>

              <ul className="flex flex-col gap-2">
                {points.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-2 text-sm font-medium leading-5 tracking-[0.01em] text-[#4A4A4A]"
                  >
                    <CheckCircleIcon className="size-5 shrink-0 text-[#008DD2]" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/Verified/Verified_Trusted.webp"
              alt={t("verifiedTrusted.imageAlt")}
              width={586}
              height={442}
              className="mx-auto w-full max-w-130 object-contain"
            />
          </div>

          <div className="rounded-[20px] border border-[#008DD233] bg-[#EEF3FF] px-6 py-8 sm:px-8.5 sm:py-10">
            <p className="text-center text-xl font-medium leading-none tracking-[0.01em] text-[#4A4A4A]">
              {t("verifiedTrusted.panelTitle")}
            </p>

            <div className="relative mt-8 flex flex-col items-stretch gap-10 lg:flex-row lg:items-start lg:gap-6 xl:justify-between xl:gap-0">
              {/* Dashed connector at circle-center height (40px = half of
                  size-20); the opaque white circles paint over it, leaving
                  dashes only in the gaps. Horizontal on desktop, vertical on
                  mobile. */}
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
                        className="whitespace-nowrap text-lg font-semibold leading-none tracking-[0.01em] lg:whitespace-normal lg:text-xl xl:whitespace-nowrap"
                        style={{ color }}
                      >
                        {step.label}
                      </span>
                      <span className="max-w-44 text-sm font-medium leading-5 tracking-[0.01em] text-[#4A4A4A] lg:max-w-40">
                        {step.desc}
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
