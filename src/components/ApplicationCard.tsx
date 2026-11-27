import Link from "next/link";
import { formatDate } from "@/lib/format";
import { STATUS_BADGE_CLASSES, STATUS_LABELS } from "@/lib/status";
import type { Application } from "@/lib/types";
import { DeleteButton } from "./DeleteButton";
import { StatusSelect } from "./StatusSelect";

export function ApplicationCard({ application }: { application: Application }) {
  const appliedAt = formatDate(application.applied_at);
  const details = [application.location, application.salary, appliedAt ? `Enviada el ${appliedAt}` : null].filter(
    (detail): detail is string => Boolean(detail),
  );

  return (
    <article className="flex h-full flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-slate-900">{application.position}</h3>
          <p className="truncate text-sm text-slate-600">{application.company}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${STATUS_BADGE_CLASSES[application.status]}`}
        >
          {STATUS_LABELS[application.status]}
        </span>
      </div>

      {details.length ? (
        <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
          {details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      ) : null}

      {application.notes ? (
        <p className="line-clamp-3 text-sm break-words whitespace-pre-line text-slate-600">{application.notes}</p>
      ) : null}

      {application.url ? (
        <a
          href={application.url}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Ver oferta ↗
        </a>
      ) : null}

      <div className="mt-auto flex flex-wrap items-start justify-between gap-2 border-t border-slate-100 pt-4">
        <StatusSelect key={application.status} id={application.id} status={application.status} />
        <div className="flex items-start gap-2">
          <Link
            href={`/dashboard/${application.id}/edit`}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50"
          >
            Editar
          </Link>
          <DeleteButton id={application.id} label={`${application.position} · ${application.company}`} />
        </div>
      </div>
    </article>
  );
}
