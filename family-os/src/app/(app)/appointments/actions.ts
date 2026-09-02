"use server";

import { sql } from "@/lib/db";
import { getCurrentMember } from "@/lib/currentMember";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";

export async function addAppointment(input: {
  title: string;
  date: string;
  time: string;
  location: string;
  notes: string;
  familyMemberId: number | null;
}) {
  const me = await getCurrentMember();
  if (!input.title.trim() || !input.date) throw new Error("Title and date are required.");
  await sql`
    INSERT INTO appointments (title, date, time, location, notes, family_member_id, created_by)
    VALUES (${input.title.trim()}, ${input.date}, ${input.time || null}, ${input.location || null}, ${input.notes || null}, ${input.familyMemberId}, ${me?.id ?? null})
  `;
  await logActivity("added", "appointment", input.title.trim());
  revalidatePath("/appointments");
  revalidatePath("/");
}

export async function deleteAppointment(id: number) {
  const rows = await sql`UPDATE appointments SET deleted_at = now() WHERE id = ${id} RETURNING title`;
  if (rows[0]) await logActivity("deleted", "appointment", rows[0].title as string);
  revalidatePath("/appointments");
  revalidatePath("/");
  revalidatePath("/trash");
}

export async function restoreAppointment(id: number) {
  const rows = await sql`UPDATE appointments SET deleted_at = NULL WHERE id = ${id} RETURNING title`;
  if (rows[0]) await logActivity("restored", "appointment", rows[0].title as string);
  revalidatePath("/appointments");
  revalidatePath("/");
  revalidatePath("/trash");
}

export async function permanentlyDeleteAppointment(id: number) {
  await sql`DELETE FROM appointments WHERE id = ${id}`;
  revalidatePath("/trash");
}
