import { redirect } from "next/navigation";
import { createClient } from "./server";

/** Devuelve el cliente y el usuario autenticado; si no hay sesión, redirige a /login. */
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}
