"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import SectionHeading from "./ui/SectionHeading";

export default function WhyChooseUs() {
  const { t } = useTranslation();
  const features = t("whyChooseUs.features", { returnObjects: true }) as string[];

  return (
    <section id="ai-matching" className="scroll-mt-24 bg-jz-blue-950 py-14">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <SectionHeading heading={t("whyChooseUs.heading")} highlight={t("whyChooseUs.headingHighlight")} />

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <h3 className="font-serif text-xl font-semibold text-jz-white-50">{t("whyChooseUs.subheading")}</h3>

            <div className="mt-6 flex flex-wrap gap-3">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center rounded-full border border-jz-grey-400 bg-jz-bg-primary px-4 py-2.5 text-sm text-jz-white-50"
                >
                  {feature}
                </div>
              ))}
            </div>

            <blockquote className="mt-8 font-serif text-xl font-bold text-jz-yellow-500">
              “{t("whyChooseUs.quote")}”
            </blockquote>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
            <Image
              src="/images/gcc-employers.jpg"
              alt={t("whyChooseUs.subheading")}
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-bottom"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
