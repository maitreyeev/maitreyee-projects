import { sql } from "./db";
import type { CalendarEvent } from "./calendarTypes";

function inRange(dateStr: string, start: string, end: string): boolean {
  return dateStr >= start && dateStr < end;
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** Every YYYY-MM-DD date in [start, end), inclusive-exclusive. */
function eachDate(start: string, end: string): string[] {
  const dates: string[] = [];
  let cur = start;
  while (cur < end) {
    dates.push(cur);
    const [y, m, d] = cur.split("-").map(Number);
    const next = new Date(Date.UTC(y, m - 1, d + 1));
    cur = `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}-${String(next.getUTCDate()).padStart(2, "0")}`;
  }
  return dates;
}

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/** Today's date (YYYY-MM-DD) in IST — the app runs on UTC servers but every
 *  household using it is in India, so "today" should mean IST's today. */
export function todayIST(): string {
  return new Date(Date.now() + IST_OFFSET_MS).toISOString().slice(0, 10);
}

/** Fetches every calendar-relevant event whose date falls in [start, end),
 *  scoped to one household. */
export async function getEventsInRange(householdId: number, start: string, end: string): Promise<CalendarEvent[]> {
  const today = todayIST();
  const displayYear = start.slice(0, 4);

  const [appts, tasks, bills, allDates, meds, trips, staffRows] = await Promise.all([
    sql`
      SELECT id, title, date::text AS date, time, location FROM appointments
      WHERE deleted_at IS NULL AND household_id = ${householdId} AND date >= ${start} AND date < ${end}
    `,
    sql`
      SELECT id, title, due_date::text AS date, is_done FROM household_tasks
      WHERE deleted_at IS NULL AND household_id = ${householdId} AND due_date >= ${start} AND due_date < ${end}
    `,
    sql`
      SELECT id, title, due_date::text AS date, is_paid, amount FROM financial_items
      WHERE deleted_at IS NULL AND household_id = ${householdId} AND due_date >= ${start} AND due_date < ${end}
    `,
    sql`SELECT id, title, date::text AS date, recurring_yearly FROM important_dates WHERE deleted_at IS NULL AND household_id = ${householdId}`,
    sql`
      SELECT id, name AS title, refill_date::text AS date FROM medicines
      WHERE deleted_at IS NULL AND household_id = ${householdId} AND active = true AND refill_date >= ${start} AND refill_date < ${end}
    `,
    sql`
      SELECT id, name AS title, destination, start_date::text AS date FROM travel_trips
      WHERE deleted_at IS NULL AND household_id = ${householdId} AND start_date >= ${start} AND start_date < ${end}
    `,
    sql`
      SELECT id, name AS title, monthly_salary, salary_due_day FROM household_staff
      WHERE deleted_at IS NULL AND household_id = ${householdId} AND salary_due_day IS NOT NULL
    `,
  ]);

  const events: CalendarEvent[] = [];

  for (const a of appts as { id: number; title: string; date: string; time: string | null; location: string | null }[]) {
    events.push({
      id: a.id,
      type: "appointment",
      date: a.date,
      time: a.time,
      title: a.title,
      sub: [a.time, a.location].filter(Boolean).join(" · ") || null,
      done: a.date < today,
      past: a.date < today,
      href: "/appointments",
    });
  }

  for (const t of tasks as { id: number; title: string; date: string; is_done: boolean }[]) {
    events.push({
      id: t.id,
      type: "task",
      date: t.date,
      time: null,
      title: t.title,
      sub: null,
      done: t.is_done,
      past: t.date < today && !t.is_done,
      href: "/tasks",
    });
  }

  for (const b of bills as { id: number; title: string; date: string; is_paid: boolean; amount: number | null }[]) {
    events.push({
      id: b.id,
      type: "bill",
      date: b.date,
      time: null,
      title: b.title,
      sub: b.amount ? `₹${Number(b.amount).toLocaleString("en-IN")}` : null,
      done: b.is_paid,
      past: b.date < today && !b.is_paid,
      href: "/bills",
    });
  }

  for (const d of allDates as { id: number; title: string; date: string; recurring_yearly: boolean }[]) {
    const occurrence = d.recurring_yearly ? `${displayYear}-${d.date.slice(5, 7)}-${d.date.slice(8, 10)}` : d.date;
    if (!inRange(occurrence, start, end)) continue;
    events.push({
      id: d.id,
      type: "date",
      date: occurrence,
      time: null,
      title: d.title,
      sub: null,
      done: occurrence < today,
      past: occurrence < today,
      href: "/dates",
    });
  }

  for (const m of meds as { id: number; title: string; date: string }[]) {
    events.push({
      id: m.id,
      type: "medicine",
      date: m.date,
      time: null,
      title: `Refill: ${m.title}`,
      sub: null,
      done: m.date < today,
      past: m.date < today,
      href: "/medicines",
    });
  }

  for (const t of trips as { id: number; title: string; destination: string | null; date: string }[]) {
    events.push({
      id: t.id,
      type: "trip",
      date: t.date,
      time: null,
      title: t.title,
      sub: t.destination,
      done: t.date < today,
      past: t.date < today,
      href: `/travel/${t.id}`,
    });
  }

  const staffList = staffRows as { id: number; title: string; monthly_salary: number | null; salary_due_day: number }[];
  if (staffList.length > 0) {
    for (const dateStr of eachDate(start, end)) {
      const [y, m, d] = dateStr.split("-").map(Number);
      const lastDay = daysInMonth(y, m);
      for (const st of staffList) {
        const effectiveDueDay = Math.min(st.salary_due_day, lastDay);
        if (d !== effectiveDueDay) continue;
        events.push({
          id: st.id,
          type: "staff",
          date: dateStr,
          time: null,
          title: `${st.title}'s salary due`,
          sub: st.monthly_salary ? `₹${Number(st.monthly_salary).toLocaleString("en-IN")}` : null,
          done: dateStr < today,
          past: dateStr < today,
          href: "/staff",
        });
      }
    }
  }

  return events.sort((a, b) => a.date.localeCompare(b.date));
}
