"use server";

import { sql } from "@/lib/db";
import { getCurrentMember } from "@/lib/currentMember";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";

export async function addMedicine(input: {
  name: string;
  dosage: string;
  schedule: string;
  refillDate: string;
  notes: string;
  familyMemberId: number | null;
}) {
  const me = await getCurrentMember();
  if (!input.name.trim()) throw new Error("Name is required.");
  await sql`
    INSERT INTO medicines (name, dosage, schedule, refill_date, notes, family_member_id, created_by)
    VALUES (${input.name.trim()}, ${input.dosage || null}, ${input.schedule || null}, ${input.refillDate || null}, ${input.notes || null}, ${input.familyMemberId}, ${me?.id ?? null})
  `;
  await logActivity("added", "medicine", input.name.trim());
  revalidatePath("/medicines");
  revalidatePath("/");
}

export async function toggleMedicineActive(id: number, active: boolean) {
  await sql`UPDATE medicines SET active = ${active} WHERE id = ${id}`;
  revalidatePath("/medicines");
}

export async function deleteMedicine(id: number) {
  const rows = await sql`UPDATE medicines SET deleted_at = now() WHERE id = ${id} RETURNING name`;
  if (rows[0]) await logActivity("deleted", "medicine", rows[0].name as string);
  revalidatePath("/medicines");
  revalidatePath("/");
  revalidatePath("/trash");
}

export async function restoreMedicine(id: number) {
  const rows = await sql`UPDATE medicines SET deleted_at = NULL WHERE id = ${id} RETURNING name`;
  if (rows[0]) await logActivity("restored", "medicine", rows[0].name as string);
  revalidatePath("/medicines");
  revalidatePath("/");
  revalidatePath("/trash");
}

export async function permanentlyDeleteMedicine(id: number) {
  await sql`DELETE FROM medicines WHERE id = ${id}`;
  revalidatePath("/trash");
}
