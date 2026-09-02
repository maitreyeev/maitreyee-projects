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
  if (!input.title.trim()) throw new Error("Title is required.");
  const amount = input.amount ? Number(input.amount) : null;
  await sql`
    INSERT INTO financial_items (type, title, provider, amount, due_date, recurring, created_by)
    VALUES (${input.type}, ${input.title.trim()}, ${input.provider || null}, ${amount}, ${input.dueDate || null}, ${input.recurring}, ${me?.id ?? null})
  `;
  await logActivity("added", "bill", input.title.trim());
  revalidatePath("/bills");
  revalidatePath("/");
}

export async function toggleItemPaid(id: number, paid: boolean) {
  const rows = await sql`UPDATE financial_items SET is_paid = ${paid} WHERE id = ${id} RETURNING title`;
  if (rows[0]) await logActivity(paid ? "marked paid" : "marked unpaid", "bill", rows[0].title as string);
  revalidatePath("/bills");
  revalidatePath("/");
}

export async function deleteFinancialItem(id: number) {
  const rows = await sql`UPDATE financial_items SET deleted_at = now() WHERE id = ${id} RETURNING title`;
  if (rows[0]) await logActivity("deleted", "bill", rows[0].title as string);
  revalidatePath("/bills");
  revalidatePath("/");
  revalidatePath("/trash");
}

export async function restoreFinancialItem(id: number) {
  const rows = await sql`UPDATE financial_items SET deleted_at = NULL WHERE id = ${id} RETURNING title`;
  if (rows[0]) await logActivity("restored", "bill", rows[0].title as string);
  revalidatePath("/bills");
  revalidatePath("/");
  revalidatePath("/trash");
}

export async function permanentlyDeleteFinancialItem(id: number) {
  await sql`DELETE FROM financial_items WHERE id = ${id}`;
  revalidatePath("/trash");
}
