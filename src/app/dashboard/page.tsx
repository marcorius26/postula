import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { createApplication } from "@/app/actions/applications";
import { ApplicationCard } from "@/components/ApplicationCard";
import { ApplicationForm } from "@/components/ApplicationForm";
import { Filters } from "@/components/Filters";
import { StatsCards } from "@/components/StatsCards";
import { filterApplications, type ApplicationFilters } from "@/lib/filters";
import { computeStats } from "@/lib/stats";
import { requireUser } from "@/lib/supabase/auth";
import { filtersSchema, firstParam } from "@/lib/validation";

export const metadata: Metadata = { title: "Mis candidaturas" };

const EMPTY_FILTERS: ApplicationFilters = { status: null, q: "" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default function DashboardPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Mis candidaturas</h1>
        <p className="mt-1 text-sm text-slate-600">Registra cada oferta y sigue en qué punto está.</p>
      </div>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function DashboardContent({ searchParams }: { searchParams: SearchParams }) {
  const { supabase } = await requireUser();
  const params = await searchParams;
  const parsedFilters = filtersSchema.safeParse({
    status: firstParam(params.status),
    q: firstParam(params.q),
  });
  const filters: ApplicationFilters = parsedFilters.success ? parsedFilters.data : EMPTY_FILTERS;

  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  const applications = data ?? [];
  const stats = computeStats(applications);
  const visible = filterApplications(applications, filters);

  return (
    <>
      <StatsCards stats={stats} activeStatus={filters.status} />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <section aria-labelledby="new-title" className="h-fit rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 lg:sticky lg:top-20">
          <h2 id="new-title" className="mb-4 font-semibold text-slate-900">
            Nueva candidatura
          </h2>
          <ApplicationForm action={createApplication} />
        </section>

        <section aria-labelledby="list-title" className="min-w-0 space-y-4">
          <div className="flex items-baseline justify-between gap-2">
            <h2 id="list-title" className="font-semibold text-slate-900">
              Candidaturas
            </h2>
            <p className="text-sm text-slate-500">
              {visible.length} de {applications.length}
            </p>
          </div>
          <Filters filters={filters} />

          {error ? (
            <p role="alert" className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
              No se han podido cargar tus candidaturas. Recarga la página o inténtalo más tarde.
            </p>
          ) : applications.length === 0 ? (
            <EmptyState
              title="Aún no tienes candidaturas"
              description="Añade la primera con el formulario y empieza a seguir tu búsqueda."
            />
          ) : visible.length === 0 ? (
            <EmptyState
              title="Ninguna candidatura coincide con los filtros"
              description="Prueba con otra búsqueda u otro estado."
              action={
                <Link href="/dashboard" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  Ver todas
                </Link>
              }
            />
          ) : (
            <ul className="grid gap-4 md:grid-cols-2">
              {visible.map((application) => (
                <li key={application.id}>
                  <ApplicationCard application={application} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <p className="font-medium text-slate-900">{title}</p>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite" className="space-y-8">
      <p className="sr-only">Cargando candidaturas…</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {Array.from({ length: 7 }, (_, index) => (
          <div key={index} className="h-20 animate-pulse rounded-2xl bg-slate-200/70" />
        ))}
      </div>
      <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
        <div className="h-96 animate-pulse rounded-2xl bg-slate-200/70" />
        <div className="h-96 animate-pulse rounded-2xl bg-slate-200/70" />
      </div>
    </div>
  );
}
