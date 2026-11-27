import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      <p className="text-sm font-medium text-indigo-600">Error 404</p>
      <h1 className="text-2xl font-semibold text-slate-900">No encontramos esta página</h1>
      <p className="text-sm text-slate-600">Puede que el enlace sea incorrecto o que la candidatura ya no exista.</p>
      <Link href="/" className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500">
        Volver al inicio
      </Link>
    </main>
  );
}
