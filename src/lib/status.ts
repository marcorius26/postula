import type { ApplicationStatus } from "./types";

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  wishlist: "Me interesa",
  applied: "Enviada",
  interview: "Entrevista",
  offer: "Oferta",
  rejected: "Descartada",
};

/** Clases de Tailwind para la etiqueta de cada estado. */
export const STATUS_BADGE_CLASSES: Record<ApplicationStatus, string> = {
  wishlist: "bg-slate-100 text-slate-700 ring-slate-200",
  applied: "bg-sky-50 text-sky-700 ring-sky-200",
  interview: "bg-amber-50 text-amber-700 ring-amber-200",
  offer: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected: "bg-rose-50 text-rose-700 ring-rose-200",
};

/** Color de acento para las tarjetas de estadísticas. */
export const STATUS_ACCENT_CLASSES: Record<ApplicationStatus, string> = {
  wishlist: "bg-slate-400",
  applied: "bg-sky-500",
  interview: "bg-amber-500",
  offer: "bg-emerald-500",
  rejected: "bg-rose-500",
};
