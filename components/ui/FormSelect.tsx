import { forwardRef, SelectHTMLAttributes } from "react";

export interface FormSelectOption {
  value: string;
  label: string;
}

interface FormSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  error?: string;
  options: FormSelectOption[];
  placeholder?: string;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, options, placeholder, className = "", id, ...rest }, ref) => {
    const selectId = id || rest.name;

    return (
      <div>
        {label && (
          <label htmlFor={selectId} className="mb-1.5 block text-sm text-jz-white-200">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`h-11 w-full rounded-xl border bg-jz-blue-900 px-3.5 text-sm text-jz-white-100 outline-none focus:border-jz-yellow-400 focus:ring-2 focus:ring-jz-yellow-400/20 ${
            error ? "border-jz-red-600" : "border-jz-border"
          } ${className}`}
          {...rest}
        >
          {placeholder && (
            <option value="" className="bg-jz-blue-900">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-jz-blue-900">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-jz-red-600">{error}</p>}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";
export default FormSelect;
