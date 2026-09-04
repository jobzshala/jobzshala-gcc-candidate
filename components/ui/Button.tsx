import type { ReactNode } from "react";
import { ChevronRightIcon } from "./icons";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  href?: string;
  className?: string;
  showIcon?: boolean;
};

const base =
  "inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm whitespace-nowrap transition-opacity hover:opacity-90";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-b from-[#FECC00] to-jz-yellow-400 text-jz-ink-on-accent font-semibold",
  secondary: " text-[#00587F] font-normal bg-[#FFFFFF]",
};

export default function Button({
  children,
  variant = "primary",
  href,
  className = "",
  showIcon = true,
}: ButtonProps) {
  const classes = cn(base, variants[variant], className);
  const content = (
    <>
      <span>{children}</span>
      {showIcon && <ChevronRightIcon className="size-4 shrink-0" />}
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button className={classes} type="button">
      {content}
    </button>
  );
}
