import { forwardRef, InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, hint, className = "", id, ...rest }, ref) => {
    const inputId = id || rest.name;

    return (
      <div>
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm text-jz-white-200">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`h-11 w-full rounded-xl border bg-jz-blue-900 px-3.5 text-sm text-jz-white-100 outline-none placeholder:text-jz-white-600 focus:border-jz-yellow-400 focus:ring-2 focus:ring-jz-yellow-400/20 ${
            error ? "border-jz-red-600" : "border-jz-border"
          } ${className}`}
          {...rest}
        />
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
