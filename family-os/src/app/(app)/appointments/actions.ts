"use server";

import { sql } from "@/lib/db";
import { getCurrentMember } from "@/lib/currentMember";
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
  revalidatePath("/appointments");
  revalidatePath("/");
}

export async function deleteAppointment(id: number) {
  await sql`DELETE FROM appointments WHERE id = ${id}`;
  revalidatePath("/appointments");
  revalidatePath("/");
}
