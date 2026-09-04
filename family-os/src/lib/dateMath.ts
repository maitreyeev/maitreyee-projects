function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function fmt(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Advances a YYYY-MM-DD date string by one cycle of the given recurrence,
 *  clamping the day-of-month so e.g. Jan 31 monthly lands on Feb 28/29. */
export function advanceDate(dateStr: string, unit: "daily" | "weekly" | "monthly" | "yearly"): string {
  const [y, m, d] = dateStr.split("-").map(Number);

  if (unit === "daily") {
    const next = new Date(Date.UTC(y, m - 1, d + 1));
    return fmt(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate());
  }
  if (unit === "weekly") {
    const next = new Date(Date.UTC(y, m - 1, d + 7));
    return fmt(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate());
  }
  if (unit === "monthly") {
    let ty = y;
    let tm = m + 1;
    if (tm > 12) {
      tm = 1;
      ty += 1;
    }
    return fmt(ty, tm, Math.min(d, daysInMonth(ty, tm)));
  }
  // yearly
  const ty = y + 1;
  return fmt(ty, m, Math.min(d, daysInMonth(ty, m)));
}
