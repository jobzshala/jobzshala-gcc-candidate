"use client";

import { useTheme } from "@/lib/theme/ThemeProvider";
import { MoonIcon, SunIcon } from "./ui/icons";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={`flex items-center justify-center rounded-xl border border-jz-border p-2 text-jz-white-200 transition-opacity hover:opacity-80 ${className}`}
    >
      {theme === "dark" ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
    </button>
  );
}
