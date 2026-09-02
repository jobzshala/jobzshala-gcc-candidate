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
  const steps = t("challenge.journeySteps", { returnObjects: true }) as string[];
  const metrics = t("challenge.metrics", { returnObjects: true }) as Metric[];

  return (
    <section className="bg-[#F6F9FA] py-16 sm:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10">
        <div className="text-center">
          <p className="text-sm font-medium leading-7.5 tracking-[0.01em] text-[#1A1A1A] sm:text-xl">
            {t("challenge.eyebrow")}
          </p>
          <h2 className="mx-auto mt-2 max-w-3xl text-2xl font-semibold leading-tight tracking-[0.01em] text-[#1A1A1A] sm:text-3xl md:text-4xl md:leading-11.5">
            {t("challenge.titleLine1")}{" "}
            <span className="text-[#008DD2]">{t("challenge.titleLine2")}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-6xl text-sm leading-6.5 tracking-[0.01em] text-[#4A4A4A] sm:text-sm">
            {t("challenge.subtitle")}
          </p>
        </div>

        <div className="mt-10 border border-[#008DD233] rounded-2xl bg-[#EEF3FF] p-6 sm:p-10">
          <p className="text-center text-xl font-medium leading-none tracking-[0.01em] text-[#4A4A4A]">
            {t("challenge.journeyTitle")}
          </p>

          <div className="relative mt-8">
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

            <div className="flex flex-col items-stretch gap-6 lg:flex-row lg:items-start lg:gap-0">
              {steps.map((step, i) => {
                const Icon = STEP_ICONS[i] ?? SearchIcon;
                const image = STEP_IMAGES[i];
                return (
                  <Fragment key={step}>
                    {i > 0 && (
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
                    )}
                    <div className="relative z-10 flex flex-col items-center gap-3 text-center lg:w-24 lg:shrink-0">
                      <span className="flex size-14 items-center justify-center overflow-hidden rounded-full bg-white text-jz-blue-500 shadow-sm">
                        {image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={image}
                            alt=""
                            className="size-8 object-contain"
                          />
                        ) : (
                          <Icon className="size-6" />
                        )}
                      </span>
                      <span className="text-xs font-medium leading-tight text-[#4A4A4A]">
                        {step}
                      </span>
                    </div>
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-6 grid max-w-4xl gap-8 sm:grid-cols-3 lg:gap-10">
          {metrics.map((m, i) => {
            const Icon = METRIC_ICONS[i] ?? CalendarIcon;
            const image = METRIC_IMAGES[i];
            return (
              <div
                key={m.unit}
                className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-sm"
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
                  <p className="text-2xl font-bold text-[#1A1A1A]">{m.value}</p>
                  <p className="text-sm font-semibold text-[#1A1A1A]">
                    {m.unit}
                  </p>
                  <p className="mt-1 text-xs text-[#4A4A4A]">{m.note}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-8 flex max-w-4xl items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#008DD2]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/journey/light.webp"
              alt=""
              className="size-5 object-contain"
            />
          </span>
          <p className="text-md font-medium leading-none tracking-[0.01em] text-[#4A4A4A]">
            {t("challenge.callout")}
          </p>
        </div>
      </div>
    </section>
  );
}
