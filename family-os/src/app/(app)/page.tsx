import Link from "next/link";
import {
  CalendarDays,
  FileText,
  Pill,
  Wallet,
  Plane,
  Phone,
  ListChecks,
  PartyPopper,
} from "lucide-react";
import Card from "@/components/Card";
import { sql } from "@/lib/db";
import { getCurrentMember } from "@/lib/currentMember";
import { getEventsInRange, todayIST } from "@/lib/calendarEvents";
import type { ActivityEntry } from "@/lib/activity";
import CalendarView from "./CalendarView";
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
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const member = await getCurrentMember();
  const sp = await searchParams;

  const today = todayIST();
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
  const prevHref = `/?month=${prevMonthDate.getUTCFullYear()}-${pad(prevMonthDate.getUTCMonth() + 1)}`;
  const nextHref = `/?month=${nextMonthDate.getUTCFullYear()}-${pad(nextMonthDate.getUTCMonth() + 1)}`;
  const monthLabel = new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const [events, upcomingAppts, dueBills, pendingTasks, billsByType, activity] = await Promise.all([
    getEventsInRange(start, end),
    sql`SELECT COUNT(*)::int AS n FROM appointments WHERE deleted_at IS NULL AND date >= CURRENT_DATE AND date <= CURRENT_DATE + INTERVAL '7 days'`,
    sql`SELECT COUNT(*)::int AS n FROM financial_items WHERE deleted_at IS NULL AND is_paid = false AND due_date IS NOT NULL AND due_date <= CURRENT_DATE + INTERVAL '30 days'`,
    sql`SELECT COUNT(*)::int AS n FROM household_tasks WHERE deleted_at IS NULL AND is_done = false`,
    sql`SELECT type, COALESCE(SUM(amount), 0)::float AS total FROM financial_items WHERE deleted_at IS NULL AND is_paid = false GROUP BY type`,
    sql`SELECT id, actor_name, actor_emoji, action, entity_type, entity_title, created_at FROM activity_log ORDER BY created_at DESC LIMIT 8`,
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          Hi {member?.emoji} {member?.name}!
        </h1>
        <p className="text-muted mt-1">Here&apos;s what&apos;s going on at home.</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="This week" value={String(upcomingAppts[0].n)} sub="appointments" tone="lavender" />
        <StatCard label="Next 30 days" value={String(dueBills[0].n)} sub="bills due" tone="butter" />
        <StatCard label="To do" value={String(pendingTasks[0].n)} sub="open tasks" tone="mint" />
      </div>

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
