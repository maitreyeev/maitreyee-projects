"use server";

import { sql } from "@/lib/db";
import { getCurrentMember } from "@/lib/currentMember";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";

export async function addShoppingItem(input: { name: string; quantity: string }) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  if (!input.name.trim()) throw new Error("Item name is required.");
  await sql`
    INSERT INTO shopping_items (household_id, name, quantity, created_by)
    VALUES (${me.householdId}, ${input.name.trim()}, ${input.quantity || null}, ${me.id})
  `;
  await logActivity("added", "shopping item", input.name.trim());
  revalidatePath("/shopping");
}

export async function toggleShoppingItemChecked(id: number, checked: boolean) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  await sql`
    UPDATE shopping_items SET is_checked = ${checked} WHERE id = ${id} AND household_id = ${me.householdId}
  `;
  revalidatePath("/shopping");
}

export async function clearCheckedShoppingItems() {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  await sql`
    UPDATE shopping_items SET deleted_at = now()
    WHERE household_id = ${me.householdId} AND is_checked = true AND deleted_at IS NULL
  `;
  revalidatePath("/shopping");
}

export async function deleteShoppingItem(id: number) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  const rows = await sql`
    UPDATE shopping_items SET deleted_at = now() WHERE id = ${id} AND household_id = ${me.householdId} RETURNING name
  `;
  if (rows[0]) await logActivity("deleted", "shopping item", rows[0].name as string);
  revalidatePath("/shopping");
  revalidatePath("/trash");
}

export async function restoreShoppingItem(id: number) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  const rows = await sql`
    UPDATE shopping_items SET deleted_at = NULL WHERE id = ${id} AND household_id = ${me.householdId} RETURNING name
  `;
  if (rows[0]) await logActivity("restored", "shopping item", rows[0].name as string);
  revalidatePath("/shopping");
  revalidatePath("/trash");
}

export async function permanentlyDeleteShoppingItem(id: number) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  await sql`DELETE FROM shopping_items WHERE id = ${id} AND household_id = ${me.householdId}`;
  revalidatePath("/trash");
}
