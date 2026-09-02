"use server";

import { sql } from "@/lib/db";
import { getCurrentMember } from "@/lib/currentMember";
import { revalidatePath } from "next/cache";

export async function addImportantDate(input: { title: string; date: string; recurringYearly: boolean; notes: string }) {
  const me = await getCurrentMember();
  if (!input.title.trim() || !input.date) throw new Error("Title and date are required.");
  await sql`
    INSERT INTO important_dates (title, date, recurring_yearly, notes, created_by)
    VALUES (${input.title.trim()}, ${input.date}, ${input.recurringYearly}, ${input.notes || null}, ${me?.id ?? null})
  `;
  revalidatePath("/dates");
}

export async function deleteImportantDate(id: number) {
  await sql`DELETE FROM important_dates WHERE id = ${id}`;
  revalidatePath("/dates");
}
