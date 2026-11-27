import { startTransition, useActionState, useEffect, useRef, type FormEvent } from "react";
import type { ActionResult } from "@/lib/types";

type FormActionFn = (prev: ActionResult, formData: FormData) => Promise<ActionResult>;

const initialState: ActionResult = { ok: false };

/**
 * `useActionState` para `<form action={formAction} onSubmit={handleSubmit}>`.
 * Sin JavaScript el formulario usa `action`; con JavaScript se envía desde `onSubmit`
 * para que React no vacíe los campos cuando la validación falla.
 * Con `resetOnSuccess` el formulario se limpia tras guardar.
 */
export function useFormAction(action: FormActionFn, { resetOnSuccess = false } = {}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(action, initialState);

  useEffect(() => {
    if (resetOnSuccess && state.ok) formRef.current?.reset();
  }, [state, resetOnSuccess]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  return { formRef, state, formAction, isPending, handleSubmit };
}
