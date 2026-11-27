"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";
import { credentialsSchema, toFieldErrors } from "@/lib/validation";

const GENERIC_ERROR = "No se ha podido completar la operación. Inténtalo de nuevo.";

function translateAuthError(message: string): string {
  const text = message.toLowerCase();
  if (text.includes("invalid login credentials")) return "Correo o contraseña incorrectos.";
  if (text.includes("email not confirmed"))
    return "Debes confirmar tu correo antes de entrar. Revisa tu bandeja de entrada.";
  if (text.includes("already registered") || text.includes("already exists"))
    return "Ya existe una cuenta con ese correo.";
  if (text.includes("rate limit") || text.includes("too many"))
    return "Demasiados intentos. Espera un momento y vuelve a probar.";
  if (text.includes("password")) return "La contraseña no cumple los requisitos de seguridad.";
  return GENERIC_ERROR;
}

function parseCredentials(formData: FormData) {
  return credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
}

export async function login(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = parseCredentials(formData);
  if (!parsed.success) {
    return { ok: false, error: "Revisa los campos marcados.", fieldErrors: toFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { ok: false, error: translateAuthError(error.message) };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = parseCredentials(formData);
  if (!parsed.success) {
    return { ok: false, error: "Revisa los campos marcados.", fieldErrors: toFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp(parsed.data);
  if (error) {
    return { ok: false, error: translateAuthError(error.message) };
  }

  if (!data.session) {
    return {
      ok: true,
      message: "Cuenta creada. Revisa tu correo para confirmarla y después inicia sesión.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    await supabase.auth.signOut();
  }
  revalidatePath("/", "layout");
  redirect("/login");
}
