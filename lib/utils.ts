import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function splitHighlight(text: string, highlight: string): [string, string, string] {
  const idx = highlight ? text.indexOf(highlight) : -1;
  if (idx === -1) return [text, "", ""];
  return [text.slice(0, idx), highlight, text.slice(idx + highlight.length)];
}
