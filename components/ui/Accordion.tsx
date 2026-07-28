"use client";

import { useState, type ReactNode } from "react";
import { ChevronDownIcon } from "./icons";

export type AccordionItem = {
  question: string;
  answer: ReactNode;
  /** Optional leading badge, e.g. a step number or icon — rendered left of the question. */
  leading?: ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
  /** Index open by default. Pass -1 to start fully collapsed. Defaults to 0. */
  defaultOpen?: number;
  className?: string;
};

export default function Accordion({ items, defaultOpen = 0, className = "" }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen >= 0 ? defaultOpen : null);

  return (
    <div className={`flex flex-col divide-y divide-jz-grey-400 rounded-2xl border border-jz-grey-400 bg-jz-bg-primary ${className}`}>
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center gap-4 px-5 py-4 text-left sm:px-6"
            >
              {item.leading}
              <span className="flex-1 font-serif text-base font-semibold text-jz-white-50">{item.question}</span>
              <ChevronDownIcon
                className={`size-5 shrink-0 text-jz-yellow-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              />
            </button>
            <div className={`grid transition-all duration-200 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <div className="px-5 pb-4 text-sm leading-relaxed text-jz-white-400 sm:px-6">{item.answer}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
