"use client";

import { useTranslation } from "react-i18next";

type Step = { label: string; desc: string };

// Index-matched to builtForWorkforce.steps.
const STEP_META: { img: string; color: string }[] = [
  { img: "/images/Build-workforce/Search.svg", color: "#008DD2" },
  { img: "/images/Build-workforce/whats-app.svg", color: "#32A37D" },
  { img: "/images/Build-workforce/Profile.svg", color: "#4423CC" },
  { img: "/images/Build-workforce/voice.svg", color: "#EE8F11" },
  { img: "/images/Build-workforce/Secure.svg", color: "#E64E4E" },
  { img: "/images/Build-workforce/Joining.svg", color: "#E64E4E" },
  { img: "/images/Build-workforce/Visa-Travel.svg", color: "#EE8F11" },
  { img: "/images/Build-workforce/Offer.svg", color: "#4423CC" },
  { img: "/images/Build-workforce/Emp.svg", color: "#32A37D" },
  { img: "/images/Build-workforce/Screening.svg", color: "#008DD2" },
];

export default function BuiltForWorkforce() {
  const { t } = useTranslation();
  const steps = t("builtForWorkforce.steps", {
    returnObjects: true,
  }) as Step[];

  return (
    <section
      id="built-for-workforce"
      className="scroll-mt-24 bg-[#F6F9FA] py-10 font-poppins sm:py-20"
    >
      <div className="mx-auto max-w-300 px-4 sm:px-0">
        <div className="flex flex-col gap-8">
          <div className="mx-auto flex max-w-3xl flex-col items-start gap-4 text-left sm:items-center sm:text-center">
            <p className="text-lg font-medium leading-7.5 tracking-[0.01em] text-[#1A1A1A] sm:text-2xl">
              {t("builtForWorkforce.eyebrow")}
            </p>
            <h2 className="text-2xl font-semibold leading-snug tracking-[0.01em] text-[#1A1A1A] sm:text-3xl md:text-4xl md:leading-11.5">
              {t("builtForWorkforce.headingLine1")}
              <br />
              <span className="text-[#008DD2]">
                {t("builtForWorkforce.headingHighlight")}
              </span>
            </h2>
            <p className="text-base font-normal leading-6.5 tracking-[0.01em] text-[#4A4A4A]">
              {t("builtForWorkforce.subtitle")}
            </p>
          </div>

          <div className="rounded-[20px] border border-[#008DD233] bg-[#EEF3FF] px-6 py-8 sm:px-8.5 sm:py-10">
            <div className="relative flex flex-col gap-10">
              {/* Right-side connector joining row 1 → row 2 (desktop only). */}
              <span
                aria-hidden="true"
                className="absolute right-[2%] top-10 hidden h-[190px] w-9 rounded-r-[28px] border-2 border-l-0 border-dashed border-[#9AA6B2] lg:block"
              />

              {[steps.slice(0, 5), steps.slice(5, 10)].map((row, rowIdx) => (
                <div key={rowIdx} className="relative min-h-[150px]">
                  {/* Dashed connector at circle-center height (40px = half of size-20). */}
                  <span
                    aria-hidden="true"
                    className={`absolute top-10 hidden border-t-2 border-dashed border-[#9AA6B2] lg:block ${
                      rowIdx === 0 ? "left-[3%] right-[8%]" : "inset-x-[8%]"
                    }`}
                  />
                  {rowIdx === 0 && (
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-8.5 hidden size-3 rotate-45 border-r-2 border-t-2 border-[#9AA6B2] lg:block"
                    />
                  )}

                  <div
                    className={`relative flex flex-col gap-10 sm:grid sm:gap-x-6 sm:gap-y-10 sm:grid-cols-3 lg:grid-cols-5 ${
                      rowIdx === 1 ? "flex-col-reverse" : ""
                    }`}
                  >
                    {row.map((step, i) => {
                      const { img, color } =
                        STEP_META[rowIdx * 5 + i] ?? STEP_META[0];
                      return (
                        <div
                          key={step.label}
                          className="flex items-center gap-4 text-left sm:mx-auto sm:max-w-40 sm:flex-col sm:items-center sm:text-center"
                        >
                          <span className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0px_4px_8px_0px_#0000001A]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img}
                              alt=""
                              className="size-9 object-contain"
                            />
                          </span>
                          <div className="flex flex-col gap-1 sm:items-center">
                            <span
                              className="text-base font-semibold leading-none tracking-[0.01em]"
                              style={{ color }}
                            >
                              {step.label}
                            </span>
                            <span className="max-w-44 text-sm font-medium leading-5 tracking-[0.01em] text-[#4A4A4A] sm:max-w-40">
                              {step.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
