import type { ReactNode } from "react";
import { Logo } from "@/components/Logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="mb-8">
        <Logo />
      </div>
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        {children}
      </div>
    </main>
  );
}
