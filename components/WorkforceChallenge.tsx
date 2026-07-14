"use client";

import { useTranslation } from "react-i18next";
import SectionHeading from "./ui/SectionHeading";
import Button from "./ui/Button";
import { CrossIcon } from "./ui/icons";

function ChallengeCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-jz-grey-400 bg-jz-bg-primary p-6">
      <h3 className="font-serif text-lg font-semibold text-jz-white-50">{title}</h3>
      <ul className="mt-4 flex flex-col gap-3">
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
    <section className="bg-jz-blue-950 py-14">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <SectionHeading heading={t("challenge.heading")} highlight={t("challenge.headingHighlight")} />

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-jz-yellow-400/40 bg-jz-bg-primary p-6 lg:col-span-2">
            <h3 className="font-serif text-xl font-semibold text-jz-white-50 sm:text-2xl">{t("challenge.title")}</h3>
            <p className="mt-4 text-jz-white-400">{t("challenge.body")}</p>
          </div>
          <div className="flex flex-col gap-4 rounded-2xl bg-jz-blue-800 p-6">
            <h3 className="font-serif text-lg font-semibold text-jz-white-50">{t("challenge.mission.title")}</h3>
            <p className="text-sm text-jz-white-200">{t("challenge.mission.body")}</p>
            <Button variant="secondary" className="mt-auto">
              {t("challenge.mission.cta")}
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <ChallengeCard title={candidates.title} items={candidates.items} />
          <ChallengeCard title={employers.title} items={employers.items} />
        </div>
      </div>
    </section>
  );
}
