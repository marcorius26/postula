import type { Application, ApplicationStats } from "./types";

/** Estados que cuentan como "respuesta" de la empresa. */
const RESPONSE_STATUSES = ["interview", "offer", "rejected"] as const;

export function computeStats(applications: ReadonlyArray<Pick<Application, "status">>): ApplicationStats {
  const byStatus: ApplicationStats["byStatus"] = {
    wishlist: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  };

  for (const { status } of applications) {
    byStatus[status] += 1;
  }

  const total = applications.length;
  const sent = total - byStatus.wishlist;
  const responses = RESPONSE_STATUSES.reduce((sum, status) => sum + byStatus[status], 0);

  return {
    total,
    byStatus,
    responseRate: sent === 0 ? 0 : Math.round((responses / sent) * 100),
  };
}
