import type { ReactNode } from "react";
import { ArrowRightIcon } from "./icons";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  href?: string;
  className?: string;
  showIcon?: boolean;
};

const base =
  "inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-sm whitespace-nowrap transition-opacity hover:opacity-90";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 text-jz-blue-800 font-semibold",
  secondary: "border border-jz-white-600 text-jz-white-100 font-normal",
};

export default function Button({ children, variant = "primary", href, className = "", showIcon = true }: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      {showIcon && <ArrowRightIcon className="size-5 shrink-0" />}
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }

  return <button className={classes} type="button">{content}</button>;
}
