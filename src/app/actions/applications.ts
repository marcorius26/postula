"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";
import {
  applicationFormToObject,
  applicationIdSchema,
  applicationSchema,
  applicationStatusSchema,
  toFieldErrors,
} from "@/lib/validation";

const NOT_AUTHENTICATED = "Tu sesión ha caducado. Vuelve a iniciar sesión.";
const INVALID_FORM = "Revisa los campos marcados.";
const INVALID_ID = "La candidatura no es válida.";
const NOT_FOUND = "No se ha encontrado la candidatura.";
const DB_ERROR = "No se ha podido guardar. Inténtalo de nuevo.";

async function getAuthenticatedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function createApplication(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { supabase, user } = await getAuthenticatedClient();
  if (!user) return { ok: false, error: NOT_AUTHENTICATED };

  const parsed = applicationSchema.safeParse(applicationFormToObject(formData));
  if (!parsed.success) {
    return { ok: false, error: INVALID_FORM, fieldErrors: toFieldErrors(parsed.error) };
  }

  const { error } = await supabase.from("applications").insert({ ...parsed.data, user_id: user.id });
  if (error) return { ok: false, error: DB_ERROR };

  revalidatePath("/dashboard");
  return { ok: true, message: "Candidatura añadida." };
}

export async function updateApplication(
  id: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const { supabase, user } = await getAuthenticatedClient();
  if (!user) return { ok: false, error: NOT_AUTHENTICATED };

  const parsedId = applicationIdSchema.safeParse(id);
  if (!parsedId.success) return { ok: false, error: INVALID_ID };

  const parsed = applicationSchema.safeParse(applicationFormToObject(formData));
  if (!parsed.success) {
    return { ok: false, error: INVALID_FORM, fieldErrors: toFieldErrors(parsed.error) };
  }

  const { data, error } = await supabase
    .from("applications")
    .update(parsed.data)
    .eq("id", parsedId.data)
    .eq("user_id", user.id)
    .select("id");
  if (error) return { ok: false, error: DB_ERROR };
  if (!data.length) return { ok: false, error: NOT_FOUND };

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/${parsedId.data}/edit`);
  redirect("/dashboard");
}

export async function updateApplicationStatus(id: string, status: string): Promise<ActionResult> {
  const { supabase, user } = await getAuthenticatedClient();
  if (!user) return { ok: false, error: NOT_AUTHENTICATED };

  const parsedId = applicationIdSchema.safeParse(id);
  if (!parsedId.success) return { ok: false, error: INVALID_ID };

  const parsedStatus = applicationStatusSchema.safeParse(status);
  if (!parsedStatus.success) return { ok: false, error: "Selecciona un estado válido." };

  const { data, error } = await supabase
    .from("applications")
    .update({ status: parsedStatus.data })
    .eq("id", parsedId.data)
    .eq("user_id", user.id)
    .select("id");
  if (error) return { ok: false, error: "No se ha podido cambiar el estado." };
  if (!data.length) return { ok: false, error: NOT_FOUND };

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteApplication(id: string): Promise<ActionResult> {
  const { supabase, user } = await getAuthenticatedClient();
  if (!user) return { ok: false, error: NOT_AUTHENTICATED };

  const parsedId = applicationIdSchema.safeParse(id);
  if (!parsedId.success) return { ok: false, error: INVALID_ID };

  const { data, error } = await supabase
    .from("applications")
    .delete()
    .eq("id", parsedId.data)
    .eq("user_id", user.id)
    .select("id");
  if (error) return { ok: false, error: "No se ha podido borrar la candidatura." };
  if (!data.length) return { ok: false, error: NOT_FOUND };

  revalidatePath("/dashboard");
  return { ok: true };
}
