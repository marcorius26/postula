"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

type SubmitButtonProps = {
  children: ReactNode;
  pendingLabel: string;
  /** Estado de envío controlado desde fuera; si no se pasa, se usa el del formulario. */
  pending?: boolean;
  variant?: "primary" | "secondary";
  className?: string;
};

const VARIANTS = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600",
  secondary:
    "bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus-visible:outline-slate-400",
};

export function SubmitButton({
  children,
  pendingLabel,
  pending,
  variant = "primary",
  className = "",
}: SubmitButtonProps) {
  const formStatus = useFormStatus();
  const isPending = pending ?? formStatus.pending;
  return (
    <button
      type="submit"
      disabled={isPending}
      aria-disabled={isPending}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
    >
      {isPending ? pendingLabel : children}
    </button>
  );
}
