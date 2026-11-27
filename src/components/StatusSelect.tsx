"use client";

import { useState, useTransition, type ChangeEvent } from "react";
import { updateApplicationStatus } from "@/app/actions/applications";
import { STATUS_LABELS } from "@/lib/status";
import { APPLICATION_STATUSES, type ApplicationStatus } from "@/lib/types";

type StatusSelectProps = {
  id: string;
  status: ApplicationStatus;
};

/** Cambio rápido de estado desde la tarjeta de la candidatura. */
export function StatusSelect({ id, status }: StatusSelectProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const selectId = `status-${id}`;

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextStatus = event.target.value;
    setError(null);
    startTransition(async () => {
      const result = await updateApplicationStatus(id, nextStatus);
      if (!result.ok) setError(result.error ?? "No se ha podido cambiar el estado.");
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={selectId} className="sr-only">
        Cambiar estado
      </label>
      <div className="flex items-center gap-2">
        <select
          id={selectId}
          defaultValue={status}
          onChange={handleChange}
          disabled={isPending}
          aria-describedby={error ? `${selectId}-error` : undefined}
          className="rounded-lg border-0 bg-white py-1.5 pr-8 pl-2 text-sm text-slate-700 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600 disabled:opacity-60"
        >
          {APPLICATION_STATUSES.map((value) => (
            <option key={value} value={value}>
              {STATUS_LABELS[value]}
            </option>
          ))}
        </select>
        {isPending ? (
          <span role="status" className="text-xs text-slate-500">
            Guardando…
          </span>
        ) : null}
      </div>
      {error ? (
        <p id={`${selectId}-error`} role="alert" className="text-xs text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
