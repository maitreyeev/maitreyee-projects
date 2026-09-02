"use server";

import { sql } from "@/lib/db";
import { getCurrentMember } from "@/lib/currentMember";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";

export async function addFinancialItem(input: {
  type: string;
  title: string;
  provider: string;
  amount: string;
  dueDate: string;
  recurring: string;
}) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  if (!input.title.trim()) throw new Error("Title is required.");
  const amount = input.amount ? Number(input.amount) : null;
  await sql`
    INSERT INTO financial_items (household_id, type, title, provider, amount, due_date, recurring, created_by)
    VALUES (${me.householdId}, ${input.type}, ${input.title.trim()}, ${input.provider || null}, ${amount}, ${input.dueDate || null}, ${input.recurring}, ${me.id})
  `;
  await logActivity("added", "bill", input.title.trim());
  revalidatePath("/bills");
  revalidatePath("/");
}

export async function toggleItemPaid(id: number, paid: boolean) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  const rows = await sql`
    UPDATE financial_items SET is_paid = ${paid} WHERE id = ${id} AND household_id = ${me.householdId} RETURNING title
  `;
  if (rows[0]) await logActivity(paid ? "marked paid" : "marked unpaid", "bill", rows[0].title as string);
  revalidatePath("/bills");
  revalidatePath("/");
}

export async function deleteFinancialItem(id: number) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  const rows = await sql`
    UPDATE financial_items SET deleted_at = now() WHERE id = ${id} AND household_id = ${me.householdId} RETURNING title
  `;
  if (rows[0]) await logActivity("deleted", "bill", rows[0].title as string);
  revalidatePath("/bills");
  revalidatePath("/");
  revalidatePath("/trash");
}

export async function restoreFinancialItem(id: number) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  const rows = await sql`
    UPDATE financial_items SET deleted_at = NULL WHERE id = ${id} AND household_id = ${me.householdId} RETURNING title
  `;
  if (rows[0]) await logActivity("restored", "bill", rows[0].title as string);
  revalidatePath("/bills");
  revalidatePath("/");
  revalidatePath("/trash");
}

export async function permanentlyDeleteFinancialItem(id: number) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  await sql`DELETE FROM financial_items WHERE id = ${id} AND household_id = ${me.householdId}`;
  revalidatePath("/trash");
}
