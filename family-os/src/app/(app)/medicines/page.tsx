import { sql } from "@/lib/db";
import { Pill } from "lucide-react";
import Card from "@/components/Card";
import MedicineForm from "./MedicineForm";
import MedicineRow from "./MedicineRow";

export default async function MedicinesPage() {
  const [medicines, members] = await Promise.all([
    sql`
      SELECT m.id, m.name, m.dosage, m.schedule, m.refill_date, m.notes, m.active, fm.name AS member_name, fm.emoji
      FROM medicines m
      LEFT JOIN family_members fm ON fm.id = m.family_member_id
      WHERE m.deleted_at IS NULL
      ORDER BY m.active DESC, m.refill_date ASC NULLS LAST
    `,
    sql`SELECT id, name, emoji FROM family_members WHERE deleted_at IS NULL ORDER BY id ASC`,
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-mint text-mint-ink flex items-center justify-center shrink-0">
          <Pill size={20} />
        </div>
        <h1 className="text-xl font-extrabold tracking-tight">Medicines</h1>
      </div>

      <MedicineForm members={members as { id: number; name: string; emoji: string }[]} />

      {medicines.length === 0 ? (
        <Card className="p-6 text-center text-muted text-sm">No medicines tracked yet.</Card>
      ) : (
        <div className="flex flex-col gap-3">
          {(medicines as {
            id: number;
            name: string;
            dosage: string | null;
            schedule: string | null;
            refill_date: string | null;
            notes: string | null;
            active: boolean;
            member_name: string | null;
            emoji: string | null;
          }[]).map((m) => (
            <MedicineRow key={m.id} medicine={m} />
          ))}
        </div>
      )}
    </div>
  );
}
