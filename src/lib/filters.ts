import type { Application, ApplicationStatus } from "./types";

export type ApplicationFilters = {
  status: ApplicationStatus | null;
  q: string;
};

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/** Filtra por estado y busca el texto en empresa o puesto (sin distinguir mayúsculas ni tildes). */
export function filterApplications<T extends Pick<Application, "status" | "company" | "position">>(
  applications: ReadonlyArray<T>,
  { status, q }: ApplicationFilters,
): T[] {
  const query = normalize(q);
  return applications.filter((application) => {
    if (status && application.status !== status) return false;
    if (!query) return true;
    return (
      normalize(application.company).includes(query) ||
      normalize(application.position).includes(query)
    );
  });
}
