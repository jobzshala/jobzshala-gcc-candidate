"use client";

import { Fragment, type ComponentType } from "react";
import { useTranslation } from "react-i18next";
import {
  SearchIcon,
  UserIcon,
  ClipboardIcon,
  GridIcon,
  DocumentIcon,
  GlobeIcon,
  HeartIcon,
  CalendarIcon,
  CreditCardIcon,
  ChevronRightIcon,
} from "./ui/icons";

type IconComponent = ComponentType<{ className?: string }>;
type Metric = { value: string; unit: string; note: string };

// Index-matched to challenge.journeySteps. Where an artwork file exists it wins;
// otherwise the line icon below is drawn instead.
const STEP_IMAGES: (string | null)[] = [
  "/images/journey/Talent.webp",
  "/images/journey/Recruiters.webp",
  "/images/journey/Manual.webp",
  "/images/journey/Employers.webp",
  "/images/journey/Documentation.webp",
  "/images/journey/Travels.webp",
  "/images/journey/PostJoining.webp",
];

const STEP_ICONS: IconComponent[] = [
  SearchIcon,
  UserIcon,
  ClipboardIcon,
  GridIcon,
  DocumentIcon,
  GlobeIcon,
  HeartIcon,
];

// Index-matched to challenge.metrics. Artwork wins where present.
const METRIC_IMAGES: (string | null)[] = [
  "/images/journey/Average.webp",
  "/images/journey/rework.webp",
  "/images/journey/documentation_p.webp",
];

const METRIC_ICONS: IconComponent[] = [CalendarIcon, CreditCardIcon, UserIcon];

export default function WorkforceChallenge() {
  const { t } = useTranslation();
  const steps = t("challenge.journeySteps", {
    returnObjects: true,
  }) as string[];
  const metrics = t("challenge.metrics", { returnObjects: true }) as Metric[];

  return (
    <section className="bg-[#F6F9FA] pt-16 pb-10 sm:pt-20 sm:pb-20">
      <div className="mx-auto max-w-300 px-4 sm:px-0">
        <div className="text-left sm:text-center">
          <p className="text-2xl font-medium leading-7.5 tracking-[0.01em] text-[#1A1A1A] sm:text-xl">
            {t("challenge.eyebrow")}
          </p>
          <h2 className="mx-auto mt-2 max-w-5xl text-[36px] font-semibold leading-[46px] tracking-[0.01em] text-[#1A1A1A] sm:text-3xl sm:leading-tight md:text-4xl md:leading-11.5">
            {t("challenge.titleLine1")}
            <span className="block text-[#008DD2]">
              {t("challenge.titleLine2")}
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-none text-base font-normal leading-6.5 tracking-[0.01em] text-[#4A4A4A]">
            {t("challenge.subtitle")}
          </p>
        </div>

        <div className="mt-8 rounded-[20px] border border-[#BEDEF6] bg-[#EEF3FF] px-10 py-8 sm:p-10">
          <p className="text-left text-xl font-medium leading-[30px] tracking-[0.01em] text-[#4A4A4A] sm:text-center sm:leading-none">
            {t("challenge.journeyTitle")}
          </p>

          <div className="relative mt-7 sm:mt-8">
            {/* Wavy dashed connector — desktop only, sits behind the icons. */}
            <svg
              aria-hidden="true"
              viewBox="0 0 1120 60"
              fill="none"
              preserveAspectRatio="none"
              className="pointer-events-none absolute left-[4%] top-1 hidden h-15 w-[92%] lg:block"
            >
              <path
                d="M0,24 Q93,6 187,24 Q280,58 373,24 Q467,6 560,24 Q653,58 747,24 Q840,6 933,24 Q1027,58 1120,24"
                stroke="#4A4A4A"
                strokeWidth="2"
                strokeDasharray="8 8"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            <div className="flex flex-col items-stretch lg:flex-row lg:items-start lg:gap-0">
              {steps.map((step, i) => {
                const Icon = STEP_ICONS[i] ?? SearchIcon;
                const image = STEP_IMAGES[i];
                return (
                  <Fragment key={step}>
                    {i > 0 && (
                      <>
                        {/* Mobile: dashed bow joining one circle to the next,
                            alternating side to side as in the design. */}
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 56 60"
                          fill="none"
                          className="h-15 w-14 shrink-0 lg:hidden"
                        >
                          <path
                            d={
                              i % 2 === 1
                                ? "M28 0 C 6 18, 6 42, 28 60"
                                : "M28 0 C 50 18, 50 42, 28 60"
                            }
                            stroke="#4A4A4A"
                            strokeWidth="2"
                            strokeDasharray="6 6"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div
                          aria-hidden="true"
                          className={`hidden lg:flex lg:flex-1 lg:items-center lg:justify-center ${
                            // gap 1,3,5 arc up; gap 2,4,6 arc down — keep the
                            // chevron sitting on the dashes either way.
                            i % 2 === 1 ? "lg:mt-3" : "lg:mt-9"
                          }`}
                        >
                          <ChevronRightIcon className="size-4 text-[#4A4A4A]" />
                        </div>
                      </>
                    )}
                    <div className="relative z-10 flex items-center gap-5 text-left lg:w-32 lg:shrink-0 lg:flex-col lg:text-center">
                      <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-jz-blue-500 shadow-[0_4px_8px_rgba(0,0,0,0.1)] lg:size-20">
                        {image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={image}
                            alt=""
                            className="size-7 object-contain lg:size-9"
                          />
                        ) : (
                          <Icon className="size-7 lg:size-8" />
                        )}
                      </span>
                      <span className="w-28 text-sm font-medium leading-5 tracking-[0.01em] text-[#4A4A4A] lg:w-auto lg:uppercase">
                        {step}
                      </span>
                    </div>
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 grid max-w-286.75 gap-9 sm:grid-cols-3">
          {metrics.map((m, i) => {
            const Icon = METRIC_ICONS[i] ?? CalendarIcon;
            const image = METRIC_IMAGES[i];
            return (
              <div
                key={m.unit}
                className="flex items-start gap-6 rounded-2xl bg-white pb-11.5 pl-5 pr-11.75 pt-5 shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
              >
                <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E5F7FF] text-jz-blue-500">
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image} alt="" className="size-7 object-contain" />
                  ) : (
                    <Icon className="size-7" />
                  )}
                </span>
                <div>
                  <p className="text-3xl font-semibold leading-11.5 tracking-[0.01em] text-[#4A4A4A] sm:text-4xl">
                    {m.value}
                  </p>
                  <p className="text-xl font-semibold leading-none tracking-[0.01em] text-[#1A1A1A]">
                    {m.unit}
                  </p>
                  <p className="mt-1 text-base font-normal leading-6.5 tracking-[0.01em] text-[#4A4A4A]">
                    {m.note}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-8 flex max-w-[1147px] items-start gap-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#008DD2]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/journey/light.webp"
              alt=""
              className="size-5 object-contain"
            />
          </span>
          <p className="text-base font-medium leading-6.5 tracking-[0.01em] text-[#4A4A4A]">
            {t("challenge.callout")}
          </p>
        </div>
      </div>
    </section>
  );
}
