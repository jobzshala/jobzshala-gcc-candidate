"use client";

import { useState, type ReactNode } from "react";
import { ChevronDownIcon } from "./icons";

export type TimelineStep = {
  title: string;
  detail: ReactNode;
  /** Pass an already-rendered icon element (e.g. `<GlobeIcon className="size-4.5" />`) — a
   * bare component reference can't cross the server → client boundary this renders through. */
  icon?: ReactNode;
};

/**
 * Vertical connected timeline where each node expands in place to reveal
 * detail — used for multi-stage processes (recruitment, verification, visa)
 * so the page reads as a walkable journey rather than a static list.
 */
export default function Timeline({ steps, className = "" }: { steps: TimelineStep[]; className?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={`flex flex-col ${className}`}>
      {steps.map((step, i) => {
        const open = openIndex === i;
        const isLast = i === steps.length - 1;

        return (
          <div key={step.title} className="relative flex gap-4">
            {!isLast && <span className="absolute top-10 bottom-0 left-[19px] w-px bg-jz-grey-400" aria-hidden="true" />}
            <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-jz-blue-400 to-jz-blue-800 text-sm font-semibold text-jz-white-50">
              {step.icon ?? i + 1}
            </span>

            <div className="min-w-0 flex-1 pb-6">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                aria-expanded={open}
                className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                  open ? "border-jz-blue-400 bg-jz-bg-primary" : "border-jz-grey-400 bg-jz-bg-primary hover:border-jz-blue-400"
                }`}
              >
                <span className="text-sm font-semibold text-jz-white-50 sm:text-base">{step.title}</span>
                <ChevronDownIcon
                  className={`size-4.5 shrink-0 text-jz-yellow-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
              </button>
              <div className={`grid transition-all duration-200 ease-out ${open ? "mt-2 grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <p className="rounded-xl bg-jz-blue-900/60 px-4 py-3 text-sm leading-relaxed text-jz-white-400">{step.detail}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
