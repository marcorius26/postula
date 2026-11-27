import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/types";
import { getSupabaseEnv } from "./env";

const PROTECTED_PREFIX = "/dashboard";
const AUTH_PAGES = ["/login", "/signup"];

function isProtectedPath(pathname: string): boolean {
  return pathname === PROTECTED_PREFIX || pathname.startsWith(`${PROTECTED_PREFIX}/`);
}

function redirectKeepingCookies(
  request: NextRequest,
  pathname: string,
  from: NextResponse,
): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  const redirect = NextResponse.redirect(url);
  from.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  from.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "set-cookie") redirect.headers.set(key, value);
  });
  return redirect;
}

/** Refresca la sesión de Supabase y aplica las redirecciones de acceso. */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });
  const { url, anonKey } = getSupabaseEnv();

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  // No ejecutes código entre createServerClient y getUser: refresca la sesión.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!user && isProtectedPath(pathname)) {
    return redirectKeepingCookies(request, "/login", response);
  }

  if (user && AUTH_PAGES.includes(pathname)) {
    return redirectKeepingCookies(request, "/dashboard", response);
  }

  return response;
}
