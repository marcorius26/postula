import type { ActionResult } from "@/lib/types";

/** Muestra el error general o el mensaje de éxito de una server action. */
export function FormMessage({ state }: { state: ActionResult }) {
  if (state.error) {
    return (
      <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">
        {state.error}
      </p>
    );
  }
  if (state.message) {
    return (
      <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 ring-1 ring-emerald-200">
        {state.message}
      </p>
    );
  }
  return null;
}
