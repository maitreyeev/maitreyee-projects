import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  FileText,
  Pill,
  Wallet,
  Plane,
  Phone,
  ListChecks,
  PartyPopper,
  HandHeart,
} from "lucide-react";
import Card from "@/components/Card";
import Avatar from "@/components/Avatar";
import { sql } from "@/lib/db";
import { getCurrentMember } from "@/lib/currentMember";
import { getEventsInRange, todayIST } from "@/lib/calendarEvents";
import type { ActivityEntry } from "@/lib/activity";
import CalendarView from "./CalendarView";
import WeekCalendarView, { type WeekDay } from "./WeekCalendarView";
import DashboardCharts from "./DashboardCharts";
import ActivityFeed from "./ActivityFeed";

const NAV_CARDS = [
  { href: "/appointments", label: "Appointments", icon: CalendarDays, tone: "lavender" as const },
  { href: "/documents", label: "Documents", icon: FileText, tone: "peach" as const },
  { href: "/medicines", label: "Medicines", icon: Pill, tone: "mint" as const },
  { href: "/bills", label: "Bills & Payments", icon: Wallet, tone: "butter" as const },
  { href: "/travel", label: "Travel", icon: Plane, tone: "sky" as const },
  { href: "/contacts", label: "Emergency Contacts", icon: Phone, tone: "blush" as const },
  { href: "/tasks", label: "Tasks", icon: ListChecks, tone: "lavender" as const },
  { href: "/dates", label: "Important Dates", icon: PartyPopper, tone: "peach" as const },
  { href: "/staff", label: "Household Help", icon: HandHeart, tone: "coral" as const },
];

const WEEKDAY_ABBR = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toISO(d: Date) {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

function addDays(iso: string, n: number): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n));
}

function weekStartOf(iso: string): Date {
  const d = addDays(iso, 0);
  return addDays(toISO(d), -((d.getUTCDay() + 6) % 7)); // Monday of that week
}

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; view?: string; week?: string }>;
}) {
  const member = await getCurrentMember();
  if (!member) redirect("/login");
  const sp = await searchParams;
  const today = todayIST();
  const view = sp.view === "week" ? "week" : "month";

  const monthToggleHref = sp.month ? `/?view=month&month=${sp.month}` : "/?view=month";
  const weekToggleHref = `/?view=week&week=${today}`;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
          Hi <Avatar emoji={member.emoji} size={32} /> {member.name}!
        </h1>
        <p className="text-muted mt-1">Here&apos;s what&apos;s going on at home.</p>
      </div>

      <StatsRow householdId={member.householdId} />

      <div className="flex rounded-full bg-surface-muted p-1 w-fit">
        <Link
          href={monthToggleHref}
          className={`px-4 h-9 flex items-center rounded-full text-sm font-bold transition-colors ${
            view === "month" ? "bg-ink text-ink-foreground" : "text-muted"
          }`}
        >
          Month
        </Link>
        <Link
          href={weekToggleHref}
          className={`px-4 h-9 flex items-center rounded-full text-sm font-bold transition-colors ${
            view === "week" ? "bg-ink text-ink-foreground" : "text-muted"
          }`}
        >
          Week
        </Link>
      </div>

      {view === "week" ? (
        <WeekView sp={sp} today={today} householdId={member.householdId} />
      ) : (
        <MonthView sp={sp} today={today} householdId={member.householdId} />
      )}

      <div className="grid grid-cols-2 gap-3">
        {NAV_CARDS.map((c) => (
          <Link key={c.href} href={c.href}>
            <Card tone={c.tone} className="p-5 flex flex-col gap-3 h-full hover:scale-[1.02] active:scale-[0.98] transition-transform">
              <c.icon size={22} />
              <span className="font-extrabold text-sm leading-tight">{c.label}</span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

async function WeekView({ sp, today, householdId }: { sp: { week?: string }; today: string; householdId: number }) {
  const anchor = sp.week && /^\d{4}-\d{2}-\d{2}$/.test(sp.week) ? sp.week : today;
  const weekStartDate = weekStartOf(anchor);
  const weekStart = toISO(weekStartDate);
  const weekEnd = toISO(addDays(weekStart, 7));

  const days: WeekDay[] = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(weekStart, i);
    const iso = toISO(d);
    return { iso, weekday: WEEKDAY_ABBR[d.getUTCDay()], dayNum: d.getUTCDate(), isToday: iso === today };
  });

  const weekStartLabel = weekStartDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const weekEndLabel = addDays(weekStart, 6).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const weekLabel = `${weekStartLabel} – ${weekEndLabel}`;

  const prevHref = `/?view=week&week=${toISO(addDays(weekStart, -7))}`;
  const nextHref = `/?view=week&week=${toISO(addDays(weekStart, 7))}`;
  const todayHref = `/?view=week&week=${today}`;

  const events = await getEventsInRange(householdId, weekStart, weekEnd);

  return (
    <WeekCalendarView
      key={weekStart}
      days={days}
      events={events}
      prevHref={prevHref}
      nextHref={nextHref}
      todayHref={todayHref}
      weekLabel={weekLabel}
    />
  );
}

async function MonthView({
  sp,
  today,
  householdId,
}: {
  sp: { month?: string };
  today: string;
  householdId: number;
}) {
  const [defYear, defMonth] = today.split("-").map(Number);
  let year = defYear;
  let month = defMonth;
  if (sp.month && /^\d{4}-\d{2}$/.test(sp.month)) {
    const [y, m] = sp.month.split("-").map(Number);
    if (m >= 1 && m <= 12) {
      year = y;
      month = m;
    }
  }

  const start = `${year}-${pad(month)}-01`;
  const endOfMonth = new Date(Date.UTC(year, month, 1));
  const end = `${endOfMonth.getUTCFullYear()}-${pad(endOfMonth.getUTCMonth() + 1)}-01`;
  const prevMonthDate = new Date(Date.UTC(year, month - 2, 1));
  const nextMonthDate = new Date(Date.UTC(year, month, 1));
  const prevHref = `/?view=month&month=${prevMonthDate.getUTCFullYear()}-${pad(prevMonthDate.getUTCMonth() + 1)}`;
  const nextHref = `/?view=month&month=${nextMonthDate.getUTCFullYear()}-${pad(nextMonthDate.getUTCMonth() + 1)}`;
  const monthLabel = new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const [events, billsByType, activity] = await Promise.all([
    getEventsInRange(householdId, start, end),
    sql`SELECT type, COALESCE(SUM(amount), 0)::float AS total FROM financial_items WHERE deleted_at IS NULL AND household_id = ${householdId} GROUP BY type`,
    sql`SELECT id, actor_name, actor_emoji, action, entity_type, entity_title, created_at FROM activity_log WHERE household_id = ${householdId} ORDER BY created_at DESC LIMIT 8`,
  ]);

  return (
    <>
      <CalendarView
        key={`${year}-${month}`}
        year={year}
        month={month}
        events={events}
        todayStr={today}
        prevHref={prevHref}
        nextHref={nextHref}
        monthLabel={monthLabel}
      />
      <DashboardCharts billsByType={billsByType as { type: string; total: number }[]} />
      <ActivityFeed entries={activity as ActivityEntry[]} />
    </>
  );
}

async function StatsRow({ householdId }: { householdId: number }) {
  const [upcomingAppts, dueBills, pendingTasks] = await Promise.all([
    sql`SELECT COUNT(*)::int AS n FROM appointments WHERE deleted_at IS NULL AND household_id = ${householdId} AND date >= CURRENT_DATE AND date <= CURRENT_DATE + INTERVAL '7 days'`,
    sql`SELECT COUNT(*)::int AS n FROM financial_items WHERE deleted_at IS NULL AND household_id = ${householdId} AND is_paid = false AND due_date IS NOT NULL AND due_date <= CURRENT_DATE + INTERVAL '30 days'`,
    sql`SELECT COUNT(*)::int AS n FROM household_tasks WHERE deleted_at IS NULL AND household_id = ${householdId} AND is_done = false`,
  ]);
  return (
    <div className="grid grid-cols-3 gap-3">
      <StatCard label="This week" value={String(upcomingAppts[0].n)} sub="appointments" tone="lavender" />
      <StatCard label="Next 30 days" value={String(dueBills[0].n)} sub="bills due" tone="butter" />
      <StatCard label="To do" value={String(pendingTasks[0].n)} sub="open tasks" tone="mint" />
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone: "lavender" | "peach" | "mint" | "sky" | "butter" | "blush";
}) {
  return (
    <Card tone={tone} className="p-4 flex flex-col gap-0.5">
      <span className="text-2xl font-extrabold">{value}</span>
      <span className="text-xs font-bold opacity-80">{sub}</span>
      <span className="text-[10px] opacity-60 mt-1">{label}</span>
    </Card>
  );
}
