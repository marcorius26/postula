"use client";

import Link from "next/link";
import { STATUS_LABELS } from "@/lib/status";
import { APPLICATION_STATUSES, type ActionResult, type Application } from "@/lib/types";
import { FormField, inputClasses } from "./FormField";
import { FormMessage } from "./FormMessage";
import { SubmitButton } from "./SubmitButton";
import { useFormAction } from "./useFormAction";

type ApplicationFormProps = {
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  application?: Application;
};

export function ApplicationForm({ action, application }: ApplicationFormProps) {
  const isEdit = Boolean(application);
  const { formRef, state, formAction, isPending, handleSubmit } = useFormAction(action, {
    resetOnSuccess: !isEdit,
  });
  const errors = state.fieldErrors ?? {};
  const prefix = isEdit ? "edit" : "new";

  const fieldProps = (name: keyof typeof FIELD_LABELS) => ({
    id: `${prefix}-${name}`,
    name,
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${prefix}-${name}-error` : undefined,
    className: inputClasses,
  });

  return (
    <form ref={formRef} action={formAction} onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormMessage state={state} />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id={`${prefix}-company`} label={FIELD_LABELS.company} errors={errors.company}>
          <input {...fieldProps("company")} required maxLength={120} defaultValue={application?.company} placeholder="Acme S.L." />
        </FormField>
        <FormField id={`${prefix}-position`} label={FIELD_LABELS.position} errors={errors.position}>
          <input {...fieldProps("position")} required maxLength={120} defaultValue={application?.position} placeholder="Desarrollador/a Frontend" />
        </FormField>
        <FormField id={`${prefix}-status`} label={FIELD_LABELS.status} errors={errors.status}>
          <select {...fieldProps("status")} defaultValue={application?.status ?? "applied"}>
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </FormField>
        <FormField id={`${prefix}-applied_at`} label={FIELD_LABELS.applied_at} errors={errors.applied_at}>
          <input {...fieldProps("applied_at")} type="date" defaultValue={application?.applied_at ?? ""} />
        </FormField>
        <FormField id={`${prefix}-location`} label={FIELD_LABELS.location} errors={errors.location}>
          <input {...fieldProps("location")} maxLength={120} defaultValue={application?.location ?? ""} placeholder="Madrid · Remoto" />
        </FormField>
        <FormField id={`${prefix}-salary`} label={FIELD_LABELS.salary} errors={errors.salary}>
          <input {...fieldProps("salary")} maxLength={60} defaultValue={application?.salary ?? ""} placeholder="30.000 – 35.000 €" />
        </FormField>
        <FormField id={`${prefix}-url`} label={FIELD_LABELS.url} errors={errors.url} className="sm:col-span-2">
          <input {...fieldProps("url")} type="url" inputMode="url" defaultValue={application?.url ?? ""} placeholder="https://empresa.com/empleo" />
        </FormField>
        <FormField id={`${prefix}-notes`} label={FIELD_LABELS.notes} errors={errors.notes} className="sm:col-span-2">
          <textarea {...fieldProps("notes")} rows={3} maxLength={2000} defaultValue={application?.notes ?? ""} placeholder="Persona de contacto, próximos pasos…" />
        </FormField>
      </div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {isEdit ? (
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
          >
            Cancelar
          </Link>
        ) : null}
        <SubmitButton pending={isPending} pendingLabel="Guardando…">{isEdit ? "Guardar cambios" : "Añadir candidatura"}</SubmitButton>
      </div>
    </form>
  );
}

const FIELD_LABELS = {
  company: "Empresa",
  position: "Puesto",
  status: "Estado",
  applied_at: "Fecha de candidatura",
  location: "Ubicación (opcional)",
  salary: "Salario (opcional)",
  url: "Enlace a la oferta (opcional)",
  notes: "Notas (opcional)",
} as const;
