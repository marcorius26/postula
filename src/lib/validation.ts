import { z } from "zod";
import { APPLICATION_STATUSES } from "./types";

const STATUS_ERROR = "Selecciona un estado válido";

export const credentialsSchema = z.object({
  email: z
    .string({ error: "Introduce tu correo electrónico" })
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: "Introduce un correo electrónico válido" })),
  password: z
    .string({ error: "Introduce tu contraseña" })
    .min(6, { error: "La contraseña debe tener al menos 6 caracteres" })
    .max(72, { error: "La contraseña no puede superar los 72 caracteres" }),
});

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (url.protocol === "http:" || url.protocol === "https:") && url.hostname.includes(".");
  } catch {
    return false;
  }
}

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

const emptyToNull = (value: string) => (value === "" ? null : value);

function requiredText(field: string, max: number) {
  return z
    .string({ error: `Indica ${field}` })
    .trim()
    .min(1, { error: `Indica ${field}` })
    .max(max, { error: `Máximo ${max} caracteres` });
}

function optionalText(max: number) {
  return z
    .string()
    .trim()
    .max(max, { error: `Máximo ${max} caracteres` })
    .transform(emptyToNull);
}

export const applicationStatusSchema = z.enum(APPLICATION_STATUSES, { error: STATUS_ERROR });

export const applicationSchema = z.object({
  company: requiredText("la empresa", 120),
  position: requiredText("el puesto", 120),
  location: optionalText(120),
  url: z
    .string()
    .trim()
    .max(500, { error: "Máximo 500 caracteres" })
    .refine((value) => value === "" || isHttpUrl(value), {
      error: "Introduce una URL válida que empiece por http:// o https://",
    })
    .transform(emptyToNull),
  status: applicationStatusSchema,
  applied_at: z
    .string()
    .trim()
    .refine((value) => value === "" || isIsoDate(value), { error: "Introduce una fecha válida" })
    .transform(emptyToNull),
  salary: optionalText(60),
  notes: optionalText(2000),
});

export const applicationIdSchema = z.uuid({ error: "Identificador de candidatura no válido" });

export const filtersSchema = z.object({
  status: z
    .string()
    .optional()
    .transform((value) => applicationStatusSchema.safeParse(value).data ?? null),
  q: z
    .string()
    .optional()
    .transform((value) => (value ?? "").trim().slice(0, 100)),
});

const APPLICATION_FIELDS = [
  "company",
  "position",
  "location",
  "url",
  "status",
  "applied_at",
  "salary",
  "notes",
] as const;

/** Extrae del FormData solo los campos de una candidatura (nunca `user_id`). */
export function applicationFormToObject(formData: FormData): Record<string, string> {
  return Object.fromEntries(
    APPLICATION_FIELDS.map((field) => {
      const value = formData.get(field);
      return [field, typeof value === "string" ? value : ""];
    }),
  );
}

/** Convierte los errores de Zod en `{ campo: [mensajes] }`. */
export function toFieldErrors(error: z.ZodError): Partial<Record<string, string[]>> {
  return z.flattenError(error).fieldErrors;
}

/** Normaliza un valor de `searchParams` (string | string[] | undefined) a string. */
export function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
