"use server";

import { sql } from "@/lib/db";
import { getCurrentMember } from "@/lib/currentMember";
import { revalidatePath } from "next/cache";

export async function addContact(input: { name: string; relation: string; phone: string; notes: string }) {
  const me = await getCurrentMember();
  if (!input.name.trim() || !input.phone.trim()) throw new Error("Name and phone are required.");
  await sql`
    INSERT INTO emergency_contacts (name, relation, phone, notes, created_by)
    VALUES (${input.name.trim()}, ${input.relation || null}, ${input.phone.trim()}, ${input.notes || null}, ${me?.id ?? null})
  `;
  revalidatePath("/contacts");
}

export async function deleteContact(id: number) {
  await sql`DELETE FROM emergency_contacts WHERE id = ${id}`;
  revalidatePath("/contacts");
}
