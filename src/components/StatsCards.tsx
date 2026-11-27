import Link from "next/link";
import { STATUS_ACCENT_CLASSES, STATUS_LABELS } from "@/lib/status";
import { APPLICATION_STATUSES, type ApplicationStats, type ApplicationStatus } from "@/lib/types";

type StatsCardsProps = {
  stats: ApplicationStats;
  activeStatus: ApplicationStatus | null;
};

export function StatsCards({ stats, activeStatus }: StatsCardsProps) {
  return (
    <section aria-labelledby="stats-title">
      <h2 id="stats-title" className="sr-only">
        Estadísticas
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        <div className="col-span-1 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-medium text-slate-500">Total</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.total}</p>
        </div>
        <div className="col-span-1 rounded-2xl bg-indigo-600 p-4 text-white shadow-sm">
          <p className="text-xs font-medium text-indigo-100">Tasa de respuesta</p>
          <p className="mt-1 text-2xl font-semibold">{stats.responseRate} %</p>
        </div>
        {APPLICATION_STATUSES.map((status) => {
          const isActive = activeStatus === status;
          return (
            <Link
              key={status}
              href={isActive ? "/dashboard" : `/dashboard?status=${status}`}
              aria-current={isActive ? "true" : undefined}
              title={isActive ? "Quitar filtro" : `Ver solo "${STATUS_LABELS[status]}"`}
              className={`rounded-2xl bg-white p-4 shadow-sm ring-1 transition hover:ring-indigo-300 ${
                isActive ? "ring-2 ring-indigo-500" : "ring-slate-200"
              }`}
            >
              <p className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <span aria-hidden="true" className={`size-2 rounded-full ${STATUS_ACCENT_CLASSES[status]}`} />
                {STATUS_LABELS[status]}
              </p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.byStatus[status]}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
