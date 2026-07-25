"use client";

import { useTranslation } from "react-i18next";
import AbuDhabiSkyline from "./ui/AbuDhabiSkyline";
import { splitHighlight } from "@/lib/utils";

export default function BuiltForAbuDhabi() {
  const { t } = useTranslation();
  const [headingBefore, headingHighlight, headingAfter] = splitHighlight(t("abuDhabi.heading"), t("abuDhabi.headingHighlight"));
  const [bodyBefore, bodyHighlight, bodyAfter] = splitHighlight(t("abuDhabi.body"), t("abuDhabi.bodyHighlight"));

  return (
    <section className="bg-jz-blue-950 py-14">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <h2 className="max-w-3xl font-serif text-3xl font-black leading-tight text-jz-white-50 sm:text-4xl">
          {headingBefore}
          {headingHighlight && <span className="italic text-jz-blue-500">{headingHighlight}</span>}
          {headingAfter}
        </h2>
        <p className="mt-4 max-w-3xl text-jz-white-200">
          {bodyBefore}
          {bodyHighlight && <span className="font-bold text-jz-white-50">{bodyHighlight}</span>}
          {bodyAfter}
        </p>

        <AbuDhabiSkyline className="mt-10 aspect-[1440/340] w-full" />
      </div>
    </section>
  );
}
