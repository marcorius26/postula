import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { updateApplication } from "@/app/actions/applications";
import { ApplicationForm } from "@/components/ApplicationForm";
import { requireUser } from "@/lib/supabase/auth";
import { applicationIdSchema } from "@/lib/validation";

export const metadata: Metadata = { title: "Editar candidatura" };

type Params = Promise<{ id: string }>;

export default function EditApplicationPage({ params }: { params: Params }) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
        ← Volver a mis candidaturas
      </Link>
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
        <h1 className="mb-6 text-xl font-semibold text-slate-900">Editar candidatura</h1>
        <Suspense fallback={<p className="text-sm text-slate-500">Cargando candidatura…</p>}>
          <EditForm params={params} />
        </Suspense>
      </section>
    </div>
  );
}

async function EditForm({ params }: { params: Params }) {
  const { supabase, user } = await requireUser();
  const { id } = await params;

  const parsedId = applicationIdSchema.safeParse(id);
  if (!parsedId.success) notFound();

  const { data: application, error } = await supabase
    .from("applications")
    .select("*")
    .eq("id", parsedId.data)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return (
      <p role="alert" className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
        No se ha podido cargar la candidatura. Inténtalo más tarde.
      </p>
    );
  }
  if (!application) notFound();

  return <ApplicationForm action={updateApplication.bind(null, application.id)} application={application} />;
}
