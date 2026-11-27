import type { ReactNode } from "react";

export const inputClasses =
  "block w-full rounded-lg border-0 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 aria-invalid:ring-rose-400";

type FormFieldProps = {
  id: string;
  label: string;
  errors?: string[];
  hint?: string;
  className?: string;
  children: ReactNode;
};

/** Envoltorio de campo: etiqueta asociada, control y mensajes de error. */
export function FormField({ id, label, errors, hint, className = "", children }: FormFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {hint && !errors?.length ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
      {errors?.length ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-rose-600">
          {errors[0]}
        </p>
      ) : null}
    </div>
  );
}
