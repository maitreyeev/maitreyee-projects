import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { Trash2 } from "lucide-react";
import { getCurrentMember } from "@/lib/currentMember";
import TrashList, { type TrashItem, type TrashType } from "./TrashList";

export default async function TrashPage() {
  const me = await getCurrentMember();
  if (!me) redirect("/login");
  const h = me.householdId;

  const [appointments, documents, medicines, bills, contacts, dates, tasks, trips, members, staff] = await Promise.all([
    sql`SELECT id, title, deleted_at FROM appointments WHERE deleted_at IS NOT NULL AND household_id = ${h}`,
    sql`SELECT id, title, deleted_at FROM documents WHERE deleted_at IS NOT NULL AND household_id = ${h}`,
    sql`SELECT id, name AS title, deleted_at FROM medicines WHERE deleted_at IS NOT NULL AND household_id = ${h}`,
    sql`SELECT id, title, deleted_at FROM financial_items WHERE deleted_at IS NOT NULL AND household_id = ${h}`,
    sql`SELECT id, name AS title, deleted_at FROM emergency_contacts WHERE deleted_at IS NOT NULL AND household_id = ${h}`,
    sql`SELECT id, title, deleted_at FROM important_dates WHERE deleted_at IS NOT NULL AND household_id = ${h}`,
    sql`SELECT id, title, deleted_at FROM household_tasks WHERE deleted_at IS NOT NULL AND household_id = ${h}`,
    sql`SELECT id, name AS title, deleted_at FROM travel_trips WHERE deleted_at IS NOT NULL AND household_id = ${h}`,
    sql`SELECT id, name AS title, deleted_at FROM family_members WHERE deleted_at IS NOT NULL AND household_id = ${h}`,
    sql`SELECT id, name AS title, deleted_at FROM household_staff WHERE deleted_at IS NOT NULL AND household_id = ${h}`,
  ]);

  const sections: { type: TrashType; rows: { id: number; title: string; deleted_at: string }[] }[] = [
    { type: "appointment", rows: appointments as { id: number; title: string; deleted_at: string }[] },
    { type: "document", rows: documents as { id: number; title: string; deleted_at: string }[] },
    { type: "medicine", rows: medicines as { id: number; title: string; deleted_at: string }[] },
    { type: "bill", rows: bills as { id: number; title: string; deleted_at: string }[] },
    { type: "contact", rows: contacts as { id: number; title: string; deleted_at: string }[] },
    { type: "date", rows: dates as { id: number; title: string; deleted_at: string }[] },
    { type: "task", rows: tasks as { id: number; title: string; deleted_at: string }[] },
    { type: "trip", rows: trips as { id: number; title: string; deleted_at: string }[] },
    { type: "member", rows: members as { id: number; title: string; deleted_at: string }[] },
    { type: "staff", rows: staff as { id: number; title: string; deleted_at: string }[] },
  ];

  const items: TrashItem[] = sections
    .flatMap((s) => s.rows.map((r) => ({ id: r.id, type: s.type, title: r.title, deletedAt: r.deleted_at })))
    .sort((a, b) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime());

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-surface-muted text-muted flex items-center justify-center shrink-0">
          <Trash2 size={20} />
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">Trash</h1>
          <p className="text-xs text-muted">Anyone can restore. Deleting forever needs the parent PIN.</p>
        </div>
      </div>

      <TrashList items={items} />
    </div>
  );
}
