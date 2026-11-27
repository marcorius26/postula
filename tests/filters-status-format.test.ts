import { describe, expect, it } from "vitest";
import { filterApplications } from "@/lib/filters";
import { formatDate } from "@/lib/format";
import { STATUS_LABELS } from "@/lib/status";
import { APPLICATION_STATUSES } from "@/lib/types";

const applications = [
  { company: "Acme", position: "Desarrollador Frontend", status: "applied" as const },
  { company: "Telefónica", position: "Ingeniero de datos", status: "interview" as const },
  { company: "Globex", position: "Diseñadora UX", status: "rejected" as const },
];

describe("filterApplications", () => {
  it("devuelve todo sin filtros", () => {
    expect(filterApplications(applications, { status: null, q: "" })).toHaveLength(3);
  });

  it("filtra por estado", () => {
    expect(filterApplications(applications, { status: "interview", q: "" })).toEqual([applications[1]]);
  });

  it("busca en empresa y puesto sin distinguir mayúsculas ni tildes", () => {
    expect(filterApplications(applications, { status: null, q: "TELEFONICA" })).toEqual([applications[1]]);
    expect(filterApplications(applications, { status: null, q: "diseñadora" })).toEqual([applications[2]]);
  });

  it("combina estado y búsqueda", () => {
    expect(filterApplications(applications, { status: "applied", q: "globex" })).toEqual([]);
  });

  it("devuelve una lista vacía si no hay candidaturas", () => {
    expect(filterApplications([], { status: "offer", q: "x" })).toEqual([]);
  });
});

describe("status", () => {
  it("tiene una etiqueta en español para cada estado", () => {
    for (const status of APPLICATION_STATUSES) {
      expect(STATUS_LABELS[status]).toBeTruthy();
    }
    expect(STATUS_LABELS.interview).toBe("Entrevista");
  });
});

describe("formatDate", () => {
  it("formatea una fecha ISO en español", () => {
    expect(formatDate("2026-03-05")).toMatch(/5 mar(\.)? 2026/);
  });

  it("devuelve null para valores vacíos o inválidos", () => {
    expect(formatDate(null)).toBeNull();
    expect(formatDate("no-fecha")).toBeNull();
  });
});
