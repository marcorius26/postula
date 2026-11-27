import { Suspense, type ReactNode } from "react";
import { logout } from "@/app/actions/auth";
import { Logo } from "@/components/Logo";
import { SubmitButton } from "@/components/SubmitButton";
import { createClient } from "@/lib/supabase/server";

async function UserEmail() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;
  return <span className="hidden truncate text-sm text-slate-500 sm:inline">{user.email}</span>;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Logo href="/dashboard" />
          <div className="flex min-w-0 items-center gap-3">
            <Suspense fallback={null}>
              <UserEmail />
            </Suspense>
            <form action={logout}>
              <SubmitButton pendingLabel="Saliendo…" variant="secondary">
                Cerrar sesión
              </SubmitButton>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
