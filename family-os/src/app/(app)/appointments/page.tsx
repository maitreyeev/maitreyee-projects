import { sql } from "@/lib/db";
import { CalendarDays } from "lucide-react";
import Card from "@/components/Card";
import AppointmentForm from "./AppointmentForm";
import AppointmentRow from "./AppointmentRow";

export default async function AppointmentsPage() {
  const [appointments, members] = await Promise.all([
    sql`
      SELECT a.id, a.title, a.date, a.time, a.location, a.notes, fm.name AS member_name, fm.emoji
      FROM appointments a
      LEFT JOIN family_members fm ON fm.id = a.family_member_id
      ORDER BY a.date ASC, a.time ASC NULLS LAST
    `,
    sql`SELECT id, name, emoji FROM family_members ORDER BY id ASC`,
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-lavender text-lavender-ink flex items-center justify-center shrink-0">
          <CalendarDays size={20} />
        </div>
        <h1 className="text-xl font-extrabold tracking-tight">Appointments</h1>
      </div>

      <AppointmentForm members={members as { id: number; name: string; emoji: string }[]} />

      {appointments.length === 0 ? (
        <Card className="p-6 text-center text-muted text-sm">No appointments yet.</Card>
      ) : (
        <div className="flex flex-col gap-3">
          {(appointments as {
            id: number;
            title: string;
            date: string;
            time: string | null;
            location: string | null;
            notes: string | null;
            member_name: string | null;
            emoji: string | null;
          }[]).map((a) => (
            <AppointmentRow key={a.id} appointment={a} />
          ))}
        </div>
      )}
    </div>
  );
}
