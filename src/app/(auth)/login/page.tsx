import type { Metadata } from "next";
import Link from "next/link";
import { login } from "@/app/actions/auth";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <>
      <h1 className="text-xl font-semibold text-slate-900">Entra en tu cuenta</h1>
      <p className="mt-1 mb-6 text-sm text-slate-600">Accede para ver y gestionar tus candidaturas.</p>
      <AuthForm action={login} mode="login" />
      <p className="mt-6 text-center text-sm text-slate-600">
        ¿No tienes cuenta?{" "}
        <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
          Crear cuenta
        </Link>
      </p>
    </>
  );
}
