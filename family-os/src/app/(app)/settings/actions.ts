"use server";

import { sql } from "@/lib/db";
import { hashSecret, verifySecret } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";

export interface MemberInput {
  name: string;
  role: "parent" | "child" | "grandparent" | "other";
  emoji: string;
  color: string;
}

export async function addMember(input: MemberInput) {
  if (!input.name.trim()) throw new Error("Name is required.");
  await sql`
    INSERT INTO family_members (name, role, emoji, color)
    VALUES (${input.name.trim()}, ${input.role}, ${input.emoji}, ${input.color})
  `;
  await logActivity("added", "family member", input.name.trim());
  revalidatePath("/settings");
  revalidatePath("/");
  revalidatePath("/login");
}

export async function updateMember(id: number, input: MemberInput) {
  if (!input.name.trim()) throw new Error("Name is required.");
  await sql`
    UPDATE family_members SET name = ${input.name.trim()}, role = ${input.role}, emoji = ${input.emoji}, color = ${input.color}
    WHERE id = ${id}
  `;
  revalidatePath("/settings");
  revalidatePath("/");
}

export async function removeMember(id: number) {
  const rows = await sql`UPDATE family_members SET deleted_at = now() WHERE id = ${id} RETURNING name`;
  if (rows[0]) await logActivity("removed", "family member", rows[0].name as string);
  revalidatePath("/settings");
  revalidatePath("/");
  revalidatePath("/trash");
}

export async function restoreMember(id: number) {
  const rows = await sql`UPDATE family_members SET deleted_at = NULL WHERE id = ${id} RETURNING name`;
  if (rows[0]) await logActivity("restored", "family member", rows[0].name as string);
  revalidatePath("/settings");
  revalidatePath("/");
  revalidatePath("/trash");
}

export async function permanentlyDeleteMember(id: number) {
  await sql`DELETE FROM family_members WHERE id = ${id}`;
  revalidatePath("/trash");
}

export async function changePasscode(currentPin: string, newPasscode: string) {
  const rows = await sql`SELECT parent_pin_hash FROM household_auth WHERE id = 1`;
  if (rows.length === 0 || !verifySecret(currentPin, rows[0].parent_pin_hash as string)) {
    throw new Error("That parent PIN isn't right.");
  }
  if (newPasscode.length < 4) throw new Error("Passcode must be at least 4 characters.");
  await sql`UPDATE household_auth SET passcode_hash = ${hashSecret(newPasscode)} WHERE id = 1`;
}

export async function changePin(currentPin: string, newPin: string) {
  const rows = await sql`SELECT parent_pin_hash FROM household_auth WHERE id = 1`;
  if (rows.length === 0 || !verifySecret(currentPin, rows[0].parent_pin_hash as string)) {
    throw new Error("That parent PIN isn't right.");
  }
  if (!/^\d{4,8}$/.test(newPin)) throw new Error("PIN must be 4-8 digits.");
  await sql`UPDATE household_auth SET parent_pin_hash = ${hashSecret(newPin)} WHERE id = 1`;
}
