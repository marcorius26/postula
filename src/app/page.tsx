import Link from "next/link";
import { Logo } from "@/components/Logo";
import { STATUS_BADGE_CLASSES, STATUS_LABELS } from "@/lib/status";
import { APPLICATION_STATUSES } from "@/lib/types";

const FEATURES = [
  {
    title: "Todo en un sitio",
    description: "Empresa, puesto, enlace a la oferta, salario, fecha y notas de cada candidatura.",
  },
  {
    title: "Estado de un vistazo",
    description: "Mueve cada candidatura entre estados con un clic y filtra o busca al instante.",
  },
  {
    title: "Estadísticas útiles",
    description: "Cuántas has enviado, cuántas avanzan y tu tasa de respuesta real.",
  },
];

const primaryLink =
  "inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500";
const secondaryLink =
  "inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-2">
          <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
            Entrar
          </Link>
          <Link href="/signup" className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700">
            Crear cuenta
          </Link>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 sm:px-6">
        <section className="grid items-center gap-12 py-12 sm:py-20 lg:grid-cols-2">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200">
              Tu búsqueda de empleo, ordenada
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-balance text-slate-900 sm:text-5xl">
              Deja de perder la pista de tus candidaturas
            </h1>
            <p className="mt-5 max-w-xl text-lg text-pretty text-slate-600">
              Postula es un panel sencillo para registrar cada oferta a la que te presentas, seguir en
              qué punto está y ver cómo avanza tu búsqueda.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className={primaryLink}>
                Crear cuenta gratis
              </Link>
              <Link href="/login" className={secondaryLink}>
                Ya tengo cuenta
              </Link>
            </div>
          </div>

          <div aria-hidden="true" className="rounded-2xl bg-white p-5 shadow-xl ring-1 ring-slate-200">
            <div className="mb-4 grid grid-cols-3 gap-3">
              {[
                ["Total", "12"],
                ["Entrevistas", "3"],
                ["Respuesta", "45 %"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="text-xl font-semibold text-slate-900">{value}</p>
                </div>
              ))}
            </div>
            <ul className="space-y-2">
              {APPLICATION_STATUSES.map((status, index) => (
                <li key={status} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {["Acme", "Globex", "Initech", "Umbrella", "Hooli"][index]}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {["Frontend", "Data Analyst", "Backend", "Product Designer", "DevOps"][index]}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${STATUS_BADGE_CLASSES[status]}`}>
                    {STATUS_LABELS[status]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid gap-4 pb-16 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <article key={feature.title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="font-semibold text-slate-900">{feature.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
            </article>
          ))}
        </section>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        Postula · Seguimiento de candidaturas de empleo
      </footer>
    </div>
  );
}
