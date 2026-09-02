"use server";

import { sql } from "@/lib/db";
import { getCurrentMember } from "@/lib/currentMember";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";

export async function addContact(input: { name: string; relation: string; phone: string; notes: string }) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  if (!input.name.trim() || !input.phone.trim()) throw new Error("Name and phone are required.");
  await sql`
    INSERT INTO emergency_contacts (household_id, name, relation, phone, notes, created_by)
    VALUES (${me.householdId}, ${input.name.trim()}, ${input.relation || null}, ${input.phone.trim()}, ${input.notes || null}, ${me.id})
  `;
  await logActivity("added", "contact", input.name.trim());
  revalidatePath("/contacts");
}

export async function deleteContact(id: number) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  const rows = await sql`
    UPDATE emergency_contacts SET deleted_at = now() WHERE id = ${id} AND household_id = ${me.householdId} RETURNING name
  `;
  if (rows[0]) await logActivity("deleted", "contact", rows[0].name as string);
  revalidatePath("/contacts");
  revalidatePath("/trash");
}

export async function restoreContact(id: number) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  const rows = await sql`
    UPDATE emergency_contacts SET deleted_at = NULL WHERE id = ${id} AND household_id = ${me.householdId} RETURNING name
  `;
  if (rows[0]) await logActivity("restored", "contact", rows[0].name as string);
  revalidatePath("/contacts");
  revalidatePath("/trash");
}

export async function permanentlyDeleteContact(id: number) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  await sql`DELETE FROM emergency_contacts WHERE id = ${id} AND household_id = ${me.householdId}`;
  revalidatePath("/trash");
}
