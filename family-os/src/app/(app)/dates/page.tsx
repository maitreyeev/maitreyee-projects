import { sql } from "@/lib/db";
import { PartyPopper } from "lucide-react";
import Card from "@/components/Card";
import DateForm from "./DateForm";
import DateRow from "./DateRow";

function nextOccurrence(dateStr: string, recurringYearly: boolean): Date {
  const d = new Date(dateStr);
  if (!recurringYearly) return d;
  const now = new Date();
  const next = new Date(now.getFullYear(), d.getMonth(), d.getDate());
  if (next < new Date(now.toDateString())) next.setFullYear(now.getFullYear() + 1);
  return next;
}

export default async function DatesPage() {
  const dates = await sql`SELECT id, title, date, recurring_yearly, notes FROM important_dates WHERE deleted_at IS NULL ORDER BY date ASC`;

  const withNext = (dates as { id: number; title: string; date: string; recurring_yearly: boolean; notes: string | null }[])
    .map((d) => ({ ...d, next: nextOccurrence(d.date, d.recurring_yearly) }))
    .sort((a, b) => a.next.getTime() - b.next.getTime());

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-peach text-peach-ink flex items-center justify-center shrink-0">
          <PartyPopper size={20} />
        </div>
        <h1 className="text-xl font-extrabold tracking-tight">Important Dates</h1>
      </div>

      <DateForm />

      {withNext.length === 0 ? (
        <Card className="p-6 text-center text-muted text-sm">No important dates yet.</Card>
      ) : (
        <div className="flex flex-col gap-3">
          {withNext.map((d) => (
            <DateRow key={d.id} item={d} />
          ))}
        </div>
      )}
    </div>
  );
}
