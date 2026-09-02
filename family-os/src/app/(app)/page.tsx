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
import DashboardCharts from "./DashboardCharts";

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

export default async function Dashboard() {
  const member = await getCurrentMember();

  const [upcomingAppts, dueBills, pendingTasks, billsByType, weekAppts] = await Promise.all([
    sql`SELECT COUNT(*)::int AS n FROM appointments WHERE date >= CURRENT_DATE AND date <= CURRENT_DATE + INTERVAL '7 days'`,
    sql`SELECT COUNT(*)::int AS n, COALESCE(SUM(amount), 0)::float AS total FROM financial_items WHERE is_paid = false AND due_date IS NOT NULL AND due_date <= CURRENT_DATE + INTERVAL '30 days'`,
    sql`SELECT COUNT(*)::int AS n FROM household_tasks WHERE is_done = false`,
    sql`SELECT type, COALESCE(SUM(amount), 0)::float AS total FROM financial_items WHERE is_paid = false GROUP BY type`,
    sql`
      SELECT a.title, a.date, a.time, fm.name AS member_name, fm.emoji
      FROM appointments a
      LEFT JOIN family_members fm ON fm.id = a.family_member_id
      WHERE a.date >= CURRENT_DATE
      ORDER BY a.date ASC, a.time ASC NULLS LAST
      LIMIT 4
    `,
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

      <DashboardCharts billsByType={billsByType as { type: string; total: number }[]} />

      {weekAppts.length > 0 && (
        <Card className="p-5">
          <h2 className="font-extrabold mb-3">Coming up</h2>
          <div className="flex flex-col gap-3">
            {(weekAppts as { title: string; date: string; time: string | null; member_name: string | null; emoji: string | null }[]).map(
              (a, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-lavender flex items-center justify-center text-lavender-ink text-sm font-extrabold shrink-0">
                    {new Date(a.date).getDate()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate">{a.title}</div>
                    <div className="text-xs text-muted">
                      {new Date(a.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                      {a.time ? ` · ${a.time}` : ""}
                      {a.member_name ? ` · ${a.emoji} ${a.member_name}` : ""}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </Card>
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
