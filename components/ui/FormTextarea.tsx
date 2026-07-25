import { forwardRef, TextareaHTMLAttributes } from "react";

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, hint, className = "", id, rows = 4, ...rest }, ref) => {
    const inputId = id || rest.name;

    return (
      <div>
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm text-jz-white-200">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={`w-full resize-y rounded-xl border bg-jz-blue-900 px-3.5 py-2.5 text-sm text-jz-white-100 outline-none placeholder:text-jz-white-600 focus:border-jz-yellow-400 focus:ring-2 focus:ring-jz-yellow-400/20 ${
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

FormTextarea.displayName = "FormTextarea";
export default FormTextarea;
