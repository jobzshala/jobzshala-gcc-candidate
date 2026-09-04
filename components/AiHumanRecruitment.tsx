"use client";

import { useTranslation } from "react-i18next";

type Item = { label: string; desc: string };

const AI_ICONS = [
  "/images/Recuiter/Source.svg",
  "/images/Recuiter/Matches_img.svg",
  "/images/Recuiter/Rank.svg",
  "/images/Recuiter/Recommended.svg",
  "/images/Recuiter/Prdicts.svg",
];
const HUMAN_ICONS = [
  "/images/Recuiter/Vallidate.svg",
  "/images/Recuiter/Calls.svg",
  "/images/Recuiter/Screen_img.svg",
  "/images/Recuiter/Understand.svg",
  "/images/Recuiter/Confirm.svg",
];

const AI_COLOR = "#5C34C9";
const HUMAN_COLOR = "#008DD2";
const AI_ICON_BG = "#FFFFFF";
const HUMAN_ICON_BG = "#E1F5FF";

function Column({
  title,
  color,
  iconBg,
  headIcon,
  items,
  icons,
  side,
}: {
  title: string;
  color: string;
  iconBg: string;
  headIcon: string;
  items: Item[];
  icons: string[];
  side: "left" | "right";
}) {
  return (
    <div
      className={`flex flex-col gap-10 rounded-[20px] border border-[#DFE6EA] bg-[#FFFFFF1A] py-8 max-sm:px-8 max-sm:py-5 ${
        side === "left" ? "pl-8 pr-6 sm:pr-16" : "pr-8 pl-6 sm:pl-16"
      }`}
    >
      <div className="flex items-center gap-4">
        <span
          className="flex size-20 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: color }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={headIcon} alt="" className="size-9 object-contain" />
        </span>
        <span className="text-2xl font-semibold leading-snug tracking-[0.01em] text-[#1A1A1A] sm:text-3xl md:text-4xl md:leading-11.5">
          {title}
        </span>
      </div>

      <ul className="flex flex-col gap-6">
        {items.map((item, i) => {
          const icon = icons[i] ?? icons[0];
          return (
            <li key={item.label} className="flex items-center gap-4">
              <span
                className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full"
                style={{ backgroundColor: iconBg }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={icon} alt="" className="size-9 object-contain" />
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-xl font-semibold leading-none tracking-[0.01em] text-[#1A1A1A]">
                  {item.label}
                </span>
                <span className="text-sm font-medium leading-5 tracking-[0.01em] text-[#4A4A4A]">
                  {item.desc}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function AiHumanRecruitment() {
  const { t } = useTranslation();
  const aiItems = t("aiHuman.aiItems", { returnObjects: true }) as Item[];
  const humansItems = t("aiHuman.humansItems", { returnObjects: true }) as Item[];

  return (
    <section
      id="ai-human-recruitment"
      className="relative scroll-mt-24 overflow-hidden bg-white py-10 font-poppins sm:py-20"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/Recuiter/AI + Human-mobile.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-50 sm:hidden"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/Recuiter/AI + Human BG.webp"
        alt=""
        aria-hidden="true"
        width={1440}
        height={1064}
        className="pointer-events-none absolute inset-0 hidden size-full object-cover opacity-50 sm:block"
      />

      <div className="relative mx-auto flex max-w-235.25 flex-col gap-8 px-4 sm:px-0">
        <div className="mx-auto flex max-w-218.5 flex-col items-start gap-5 text-left sm:items-center sm:text-center">
          <p className="text-lg font-medium leading-7.5 tracking-[0.01em] text-[#1A1A1A] sm:text-2xl">
            {t("aiHuman.eyebrow")}
          </p>
          <h2 className="text-2xl font-semibold leading-snug tracking-[0.01em] text-[#1A1A1A] sm:text-3xl md:text-4xl md:leading-11.5">
            {t("aiHuman.headingLine1")}
            <br />
            <span className="text-[#008DD2]">{t("aiHuman.headingHighlight")}</span>
          </h2>
          <p className="leading-6.5 tracking-[0.01em] text-[#4A4A4A]">
            {t("aiHuman.subtitle")}
          </p>
        </div>

        <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
          <Column
            title={t("aiHuman.aiTitle")}
            color={AI_COLOR}
            iconBg={AI_ICON_BG}
            headIcon="/images/Recuiter/ai 2.svg"
            items={aiItems}
            icons={AI_ICONS}
            side="left"
          />

          <span
            aria-hidden="true"
            className="mx-auto flex size-12 items-center justify-center rounded-full bg-white"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/Recuiter/%2B.svg"
              alt=""
              className="size-5 object-contain"
            />
          </span>

          <Column
            title={t("aiHuman.humansTitle")}
            color={HUMAN_COLOR}
            iconBg={HUMAN_ICON_BG}
            headIcon="/images/Recuiter/Humans.svg"
            items={humansItems}
            icons={HUMAN_ICONS}
            side="right"
          />
        </div>
      </div>
    </section>
  );
}
