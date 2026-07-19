import { useTranslation } from "react-i18next";
import { ArrowRightIcon } from "./icons";

// Two distinct destinations (employer vs candidate) that used to share one
// CTA button. Rendered as a single visually-unified pill with two
// independently clickable segments, split by a divider, rather than two
// plain separate buttons — makes clear they're a pair of related actions,
// not two unrelated nav items.
export default function HeaderCta({ stacked = false, className = "" }: { stacked?: boolean; className?: string }) {
  const { t } = useTranslation();

  return (
    <div
      className={`flex overflow-hidden rounded-xl border border-jz-yellow-400/40 ${
        stacked ? "flex-col" : "flex-row items-stretch"
      } ${className}`}
    >
      <a
        href="/hire/login"
        className={`group flex items-center justify-center gap-1.5 bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 px-4 py-2.5 text-center text-sm font-semibold text-jz-ink-on-accent transition-opacity hover:opacity-90 ${
          stacked ? "w-full" : "max-w-[9rem]"
        }`}
      >
        <span className="leading-tight">{t("nav.cta")}</span>
        <ArrowRightIcon className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
      </a>
      <div className={stacked ? "h-px bg-jz-yellow-400/40" : "w-px bg-jz-yellow-400/40"} />
      <a
        href="/register"
        className={`flex items-center justify-center bg-jz-blue-900 px-4 py-2.5 text-center text-sm leading-tight font-medium text-jz-white-100 transition-colors hover:bg-jz-blue-900/70 hover:text-jz-yellow-400 ${
          stacked ? "w-full" : "max-w-[10rem]"
        }`}
      >
        {t("nav.ctaCandidate")}
      </a>
    </div>
  );
}
