const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** Convierte una fecha `YYYY-MM-DD` en texto legible en español (p. ej. "5 mar 2026"). */
export function formatDate(isoDate: string | null): string | null {
  if (!isoDate) return null;
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;
  return dateFormatter.format(date);
}
