"use server";

import { sql } from "@/lib/db";
import { getCurrentMember } from "@/lib/currentMember";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";

export async function addImportantDate(input: { title: string; date: string; recurringYearly: boolean; notes: string }) {
  const me = await getCurrentMember();
  if (!input.title.trim() || !input.date) throw new Error("Title and date are required.");
  await sql`
    INSERT INTO important_dates (title, date, recurring_yearly, notes, created_by)
    VALUES (${input.title.trim()}, ${input.date}, ${input.recurringYearly}, ${input.notes || null}, ${me?.id ?? null})
  `;
  await logActivity("added", "date", input.title.trim());
  revalidatePath("/dates");
  revalidatePath("/");
}

export async function deleteImportantDate(id: number) {
  const rows = await sql`UPDATE important_dates SET deleted_at = now() WHERE id = ${id} RETURNING title`;
  if (rows[0]) await logActivity("deleted", "date", rows[0].title as string);
  revalidatePath("/dates");
  revalidatePath("/");
  revalidatePath("/trash");
}

export async function restoreImportantDate(id: number) {
  const rows = await sql`UPDATE important_dates SET deleted_at = NULL WHERE id = ${id} RETURNING title`;
  if (rows[0]) await logActivity("restored", "date", rows[0].title as string);
  revalidatePath("/dates");
  revalidatePath("/");
  revalidatePath("/trash");
}

export async function permanentlyDeleteImportantDate(id: number) {
  await sql`DELETE FROM important_dates WHERE id = ${id}`;
  revalidatePath("/trash");
}
