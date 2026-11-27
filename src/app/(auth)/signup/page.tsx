import type { Metadata } from "next";
import Link from "next/link";
import { signup } from "@/app/actions/auth";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = { title: "Crear cuenta" };

export default function SignupPage() {
  return (
    <>
      <h1 className="text-xl font-semibold text-slate-900">Crea tu cuenta</h1>
      <p className="mt-1 mb-6 text-sm text-slate-600">Empieza a organizar tu búsqueda de empleo en un minuto.</p>
      <AuthForm action={signup} mode="signup" />
      <p className="mt-6 text-center text-sm text-slate-600">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
          Entrar
        </Link>
      </p>
    </>
  );
}
