"use client";

import { useTranslation } from "react-i18next";

// Ported from the approved static reference (jobzshala-redesign_4.html's
// `.corridor-wrap`) — a dashed, animated flight-path curve from India to the
// GCC with pulsing source/destination nodes and two floating label cards.
export default function CorridorVisual({ className = "" }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 420 420" fill="none" className="size-full" aria-hidden="true">
        <path
          d="M 50 320 C 130 290, 170 190, 220 145 C 260 105, 300 85, 370 60"
          stroke="#C9A15A"
          strokeWidth="1.5"
          strokeDasharray="2 8"
          strokeLinecap="round"
          opacity="0.7"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-200" dur="6s" repeatCount="indefinite" />
        </path>

        <circle cx="50" cy="320" r="5" fill="#008DD2" />
        <circle cx="50" cy="320" r="12" fill="none" stroke="#008DD2" strokeWidth="1" opacity="0.4">
          <animate attributeName="r" values="9;19;19" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0;0" dur="2.4s" repeatCount="indefinite" />
        </circle>

        <circle cx="370" cy="60" r="5" fill="#FECC00" />
        <circle cx="370" cy="60" r="12" fill="none" stroke="#FECC00" strokeWidth="1" opacity="0.4">
          <animate attributeName="r" values="9;19;19" dur="2.4s" begin="0.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0;0" dur="2.4s" begin="0.6s" repeatCount="indefinite" />
        </circle>
      </svg>

      <div className="absolute bottom-[8%] left-0 animate-[corridorFloat_5s_ease-in-out_infinite] rounded-[14px] border border-[#C9A15A]/25 bg-jz-blue-900 px-5 py-4 shadow-lg">
        <div className="text-sm font-semibold text-jz-white-50">{t("corridor.nodeIndia.title")}</div>
        <div className="mt-1 font-mono text-[11px] tracking-wide text-jz-white-400 uppercase">
          {t("corridor.nodeIndia.subtitle")}
        </div>
      </div>

      <div
        className="absolute top-[2%] right-0 animate-[corridorFloat_5s_ease-in-out_infinite] rounded-[14px] border border-[#C9A15A]/25 bg-jz-blue-900 px-5 py-4 shadow-lg"
        style={{ animationDelay: "0.4s" }}
      >
        <div className="text-sm font-semibold text-jz-white-50">{t("corridor.nodeGcc.title")}</div>
        <div className="mt-1 font-mono text-[11px] tracking-wide text-jz-white-400 uppercase">
          {t("corridor.nodeGcc.subtitle")}
        </div>
      </div>

      <style>{`
        @keyframes corridorFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
