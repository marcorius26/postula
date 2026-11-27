"use client";

import { useState, useTransition } from "react";
import { deleteApplication } from "@/app/actions/applications";

type DeleteButtonProps = {
  id: string;
  label: string;
};

/** Borra una candidatura tras pedir confirmación. */
export function DeleteButton({ id, label }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    if (!window.confirm(`¿Seguro que quieres borrar la candidatura "${label}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await deleteApplication(id);
      if (!result.ok) setError(result.error ?? "No se ha podido borrar la candidatura.");
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="rounded-lg px-3 py-1.5 text-sm font-medium text-rose-600 ring-1 ring-inset ring-rose-200 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Borrando…" : "Borrar"}
      </button>
      {error ? (
        <p role="alert" className="text-xs text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
