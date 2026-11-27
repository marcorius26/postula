import Form from "next/form";
import Link from "next/link";
import type { ApplicationFilters } from "@/lib/filters";
import { STATUS_LABELS } from "@/lib/status";
import { APPLICATION_STATUSES } from "@/lib/types";
import { inputClasses } from "./FormField";
import { SubmitButton } from "./SubmitButton";

/** Filtro por estado y búsqueda por empresa/puesto mediante searchParams (GET). */
export function Filters({ filters }: { filters: ApplicationFilters }) {
  const hasFilters = Boolean(filters.status || filters.q);

  return (
    <Form
      action="/dashboard"
      key={`${filters.status ?? ""}|${filters.q}`}
      role="search"
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        <label htmlFor="filter-q" className="mb-1 block text-sm font-medium text-slate-700">
          Buscar
        </label>
        <input
          id="filter-q"
          name="q"
          type="search"
          defaultValue={filters.q}
          maxLength={100}
          placeholder="Empresa o puesto"
          className={inputClasses}
        />
      </div>
      <div className="sm:w-48">
        <label htmlFor="filter-status" className="mb-1 block text-sm font-medium text-slate-700">
          Estado
        </label>
        <select id="filter-status" name="status" defaultValue={filters.status ?? ""} className={inputClasses}>
          <option value="">Todos los estados</option>
          {APPLICATION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <SubmitButton pendingLabel="Filtrando…" variant="secondary" className="flex-1 sm:flex-none">
          Filtrar
        </SubmitButton>
        {hasFilters ? (
          <Link
            href="/dashboard"
            className="inline-flex flex-1 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 sm:flex-none"
          >
            Limpiar
          </Link>
        ) : null}
      </div>
    </Form>
  );
}
