import { InputHTMLAttributes } from "react";
import { CheckIcon } from "./icons";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
}

export default function Checkbox({ label, className = "", id, checked, ...rest }: CheckboxProps) {
  const inputId = id || rest.name;

  return (
    <label htmlFor={inputId} className={`flex cursor-pointer items-center gap-2 text-sm text-jz-white-200 ${className}`}>
      <span className="relative inline-flex size-4.5 shrink-0 items-center justify-center">
        <input id={inputId} type="checkbox" checked={checked} className="peer sr-only" {...rest} />
        <span className="absolute inset-0 rounded-md border border-jz-border bg-jz-blue-900 peer-checked:border-jz-yellow-400 peer-checked:bg-jz-yellow-400 peer-focus-visible:ring-2 peer-focus-visible:ring-jz-yellow-400/40" />
        <CheckIcon className="relative size-3 text-jz-blue-800 opacity-0 peer-checked:opacity-100" />
      </span>
      {label}
    </label>
  );
}
