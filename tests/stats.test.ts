import { describe, expect, it } from "vitest";
import { computeStats } from "@/lib/stats";
import type { ApplicationStatus } from "@/lib/types";

const withStatuses = (...statuses: ApplicationStatus[]) => statuses.map((status) => ({ status }));

describe("computeStats", () => {
  it("devuelve todo a cero con una lista vacía", () => {
    expect(computeStats([])).toEqual({
      total: 0,
      byStatus: { wishlist: 0, applied: 0, interview: 0, offer: 0, rejected: 0 },
      responseRate: 0,
    });
  });

  it("cuenta las candidaturas por estado", () => {
    const stats = computeStats(
      withStatuses("applied", "applied", "interview", "offer", "rejected", "wishlist"),
    );
    expect(stats.total).toBe(6);
    expect(stats.byStatus).toEqual({ wishlist: 1, applied: 2, interview: 1, offer: 1, rejected: 1 });
  });

  it("calcula la tasa de respuesta excluyendo wishlist", () => {
    // 3 respuestas de 5 enviadas (la de wishlist no cuenta) → 60 %
    const stats = computeStats(
      withStatuses("applied", "applied", "interview", "offer", "rejected", "wishlist"),
    );
    expect(stats.responseRate).toBe(60);
  });

  it("redondea la tasa de respuesta al entero más cercano", () => {
    expect(computeStats(withStatuses("applied", "applied", "interview")).responseRate).toBe(33);
    expect(computeStats(withStatuses("applied", "interview", "offer")).responseRate).toBe(67);
  });

  it("devuelve 0 si solo hay candidaturas en wishlist", () => {
    expect(computeStats(withStatuses("wishlist", "wishlist")).responseRate).toBe(0);
  });

  it("devuelve 100 si todas las enviadas tienen respuesta", () => {
    expect(computeStats(withStatuses("interview", "rejected", "wishlist")).responseRate).toBe(100);
  });

  it("devuelve 0 si ninguna enviada tiene respuesta", () => {
    expect(computeStats(withStatuses("applied", "applied")).responseRate).toBe(0);
  });
});
