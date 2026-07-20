"use client";

import { useTranslation } from "react-i18next";
import SectionHeading from "./ui/SectionHeading";
import { CrossIcon, BriefcaseIcon, UserIcon, SparkleIcon } from "./ui/icons";

function ChallengeCard({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-jz-grey-400 bg-gradient-to-br from-jz-bg-primary to-jz-blue-900 p-7">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-jz-blue-800 text-jz-yellow-400">
          {icon}
        </div>
        <h3 className="font-serif text-lg font-semibold text-jz-white-50">{title}</h3>
      </div>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-3 text-sm text-jz-white-200">
            <CrossIcon className="size-5 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function WorkforceChallenge() {
  const { t } = useTranslation();
  const candidates = t("challenge.candidates", { returnObjects: true }) as { title: string; items: string[] };
  const employers = t("challenge.employers", { returnObjects: true }) as { title: string; items: string[] };

  return (
    <section className="bg-jz-blue-950 py-14 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <SectionHeading
          heading={t("challenge.heading")}
          highlight={t("challenge.headingHighlight")}
          subheading={t("challenge.body")}
          align="center"
        />
        <p className="mx-auto mt-3 max-w-3xl text-center font-serif text-lg font-medium text-jz-white-100 sm:text-xl">
          {t("challenge.title")}
        </p>

        <div className="mt-12 grid items-center gap-6 lg:grid-cols-3">
          <ChallengeCard icon={<BriefcaseIcon className="size-5" />} title={employers.title} items={employers.items} />

          <div className="relative z-10 flex flex-col items-center gap-4 rounded-2xl bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 p-8 text-center text-jz-ink-on-accent shadow-2xl lg:-my-6 lg:py-12">
            <SparkleIcon className="size-8" />
            <h3 className="font-serif text-xl font-semibold">{t("challenge.mission.title")}</h3>
            <p className="text-sm leading-relaxed">{t("challenge.mission.body")}</p>
            <button
              type="button"
              className="mt-2 rounded-xl bg-jz-blue-950 px-6 py-2.5 text-sm font-medium text-jz-white-50 transition-opacity hover:opacity-90"
            >
              {t("challenge.mission.cta")}
            </button>
          </div>

          <ChallengeCard icon={<UserIcon className="size-5" />} title={candidates.title} items={candidates.items} />
        </div>
      </div>
    </section>
  );
}
