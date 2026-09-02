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
  if (!me) throw new Error("Not signed in.");
  if (!input.name.trim()) throw new Error("Name is required.");
  await sql`
    INSERT INTO medicines (household_id, name, dosage, schedule, refill_date, notes, family_member_id, created_by)
    VALUES (${me.householdId}, ${input.name.trim()}, ${input.dosage || null}, ${input.schedule || null}, ${input.refillDate || null}, ${input.notes || null}, ${input.familyMemberId}, ${me.id})
  `;
  await logActivity("added", "medicine", input.name.trim());
  revalidatePath("/medicines");
  revalidatePath("/");
}

export async function toggleMedicineActive(id: number, active: boolean) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  await sql`UPDATE medicines SET active = ${active} WHERE id = ${id} AND household_id = ${me.householdId}`;
  revalidatePath("/medicines");
}

export async function deleteMedicine(id: number) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  const rows = await sql`
    UPDATE medicines SET deleted_at = now() WHERE id = ${id} AND household_id = ${me.householdId} RETURNING name
  `;
  if (rows[0]) await logActivity("deleted", "medicine", rows[0].name as string);
  revalidatePath("/medicines");
  revalidatePath("/");
  revalidatePath("/trash");
}

export async function restoreMedicine(id: number) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  const rows = await sql`
    UPDATE medicines SET deleted_at = NULL WHERE id = ${id} AND household_id = ${me.householdId} RETURNING name
  `;
  if (rows[0]) await logActivity("restored", "medicine", rows[0].name as string);
  revalidatePath("/medicines");
  revalidatePath("/");
  revalidatePath("/trash");
}

export async function permanentlyDeleteMedicine(id: number) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  await sql`DELETE FROM medicines WHERE id = ${id} AND household_id = ${me.householdId}`;
  revalidatePath("/trash");
}
