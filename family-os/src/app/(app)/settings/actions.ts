"use server";

import { sql } from "@/lib/db";
import { hashSecret, verifySecret, getSession } from "@/lib/auth";
import { getCurrentMember } from "@/lib/currentMember";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";

export interface MemberInput {
  name: string;
  role: "parent" | "child" | "grandparent" | "other";
  emoji: string;
  color: string;
}

export async function addMember(input: MemberInput) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  if (!input.name.trim()) throw new Error("Name is required.");
  await sql`
    INSERT INTO family_members (household_id, name, role, emoji, color)
    VALUES (${me.householdId}, ${input.name.trim()}, ${input.role}, ${input.emoji}, ${input.color})
  `;
  await logActivity("added", "family member", input.name.trim());
  revalidatePath("/settings");
  revalidatePath("/");
  revalidatePath("/login");
}

export async function updateMember(id: number, input: MemberInput) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  if (!input.name.trim()) throw new Error("Name is required.");
  await sql`
    UPDATE family_members SET name = ${input.name.trim()}, role = ${input.role}, emoji = ${input.emoji}, color = ${input.color}
    WHERE id = ${id} AND household_id = ${me.householdId}
  `;
  revalidatePath("/settings");
  revalidatePath("/");
}

export async function removeMember(id: number) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  const rows = await sql`
    UPDATE family_members SET deleted_at = now() WHERE id = ${id} AND household_id = ${me.householdId} RETURNING name
  `;
  if (rows[0]) await logActivity("removed", "family member", rows[0].name as string);
  revalidatePath("/settings");
  revalidatePath("/");
  revalidatePath("/trash");
}

export async function restoreMember(id: number) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  const rows = await sql`
    UPDATE family_members SET deleted_at = NULL WHERE id = ${id} AND household_id = ${me.householdId} RETURNING name
  `;
  if (rows[0]) await logActivity("restored", "family member", rows[0].name as string);
  revalidatePath("/settings");
  revalidatePath("/");
  revalidatePath("/trash");
}

export async function permanentlyDeleteMember(id: number) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  await sql`DELETE FROM family_members WHERE id = ${id} AND household_id = ${me.householdId}`;
  revalidatePath("/trash");
}

// Both return { error } instead of throwing — see setup/actions.ts
// completeSetup for why (thrown Server Action errors get redacted to a
// "Minified React error #441" in production builds). This pair is the
// most user-reachable spot for that bug: a mistyped PIN or a colliding
// passcode are everyday mistakes, not edge cases.
export async function changePasscode(currentPin: string, newPasscode: string): Promise<{ error?: string }> {
  const session = await getSession();
  if (!session) return { error: "Not signed in." };
  const rows = await sql`SELECT parent_pin_hash FROM household_auth WHERE id = ${session.householdId}`;
  if (rows.length === 0 || !verifySecret(currentPin, rows[0].parent_pin_hash as string)) {
    return { error: "That parent PIN isn't right." };
  }
  if (newPasscode.length < 4) return { error: "Passcode must be at least 4 characters." };
  const others = await sql`SELECT passcode_hash FROM household_auth WHERE id != ${session.householdId}`;
  const collision = (others as { passcode_hash: string }[]).some((h) => verifySecret(newPasscode, h.passcode_hash));
  if (collision) return { error: "That passcode is already used by another household on this app." };
  await sql`UPDATE household_auth SET passcode_hash = ${hashSecret(newPasscode)} WHERE id = ${session.householdId}`;
  return {};
}

export async function changePin(currentPin: string, newPin: string): Promise<{ error?: string }> {
  const session = await getSession();
  if (!session) return { error: "Not signed in." };
  const rows = await sql`SELECT parent_pin_hash FROM household_auth WHERE id = ${session.householdId}`;
  if (rows.length === 0 || !verifySecret(currentPin, rows[0].parent_pin_hash as string)) {
    return { error: "That parent PIN isn't right." };
  }
  if (!/^\d{4,8}$/.test(newPin)) return { error: "PIN must be 4-8 digits." };
  await sql`UPDATE household_auth SET parent_pin_hash = ${hashSecret(newPin)} WHERE id = ${session.householdId}`;
  return {};
}
