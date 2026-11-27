"use client";

import type { ActionResult } from "@/lib/types";
import { FormField, inputClasses } from "./FormField";
import { FormMessage } from "./FormMessage";
import { SubmitButton } from "./SubmitButton";
import { useFormAction } from "./useFormAction";

type AuthFormProps = {
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  mode: "login" | "signup";
};

export function AuthForm({ action, mode }: AuthFormProps) {
  const { formRef, state, formAction, isPending, handleSubmit } = useFormAction(action, {
    resetOnSuccess: mode === "signup",
  });
  const isSignup = mode === "signup";
  const errors = state.fieldErrors ?? {};

  return (
    <form ref={formRef} action={formAction} onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormMessage state={state} />
      <FormField id="email" label="Correo electrónico" errors={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="tu@correo.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={inputClasses}
        />
      </FormField>
      <FormField
        id="password"
        label="Contraseña"
        errors={errors.password}
        hint={isSignup ? "Mínimo 6 caracteres." : undefined}
      >
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          required
          minLength={6}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "password-error" : undefined}
          className={inputClasses}
        />
      </FormField>
      <SubmitButton pending={isPending} pendingLabel={isSignup ? "Creando cuenta…" : "Entrando…"} className="w-full">
        {isSignup ? "Crear cuenta" : "Entrar"}
      </SubmitButton>
    </form>
  );
}
