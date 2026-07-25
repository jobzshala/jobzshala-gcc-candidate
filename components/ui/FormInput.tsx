import { forwardRef, InputHTMLAttributes, useState } from "react";
import { EyeIcon, EyeOffIcon } from "./icons";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, hint, className = "", id, type, ...rest }, ref) => {
    const inputId = id || rest.name;
    const isPassword = type === "password";
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div>
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm text-jz-white-200">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={isPassword ? (showPassword ? "text" : "password") : type}
            className={`h-11 w-full rounded-xl border bg-jz-blue-900 px-3.5 text-sm text-jz-white-100 outline-none placeholder:text-jz-white-600 focus:border-jz-yellow-400 focus:ring-2 focus:ring-jz-yellow-400/20 ${
              isPassword ? "pr-11" : ""
            } ${error ? "border-jz-red-600" : "border-jz-border"} ${className}`}
            {...rest}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-jz-white-600 hover:text-jz-white-200"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOffIcon className="size-5" /> : <EyeIcon className="size-5" />}
            </button>
          )}
        </div>
        {error ? (
          <p className="mt-1 text-xs text-jz-red-600">{error}</p>
        ) : hint ? (
          <p className="mt-1 text-xs text-jz-white-600">{hint}</p>
        ) : null}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
export default FormInput;
