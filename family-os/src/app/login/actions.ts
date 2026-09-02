"use server";

import { sql } from "@/lib/db";
import { verifySecret, createSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export interface MemberOption {
  id: number;
  name: string;
  role: string;
  emoji: string;
  color: string;
}

export async function verifyPasscode(passcode: string): Promise<MemberOption[]> {
  const rows = await sql`SELECT passcode_hash FROM household_auth WHERE id = 1`;
  if (rows.length === 0) throw new Error("Household not set up yet.");
  if (!verifySecret(passcode, rows[0].passcode_hash as string)) {
    throw new Error("That passcode isn't right.");
  }
  const members = await sql`
    SELECT id, name, role, emoji, color FROM family_members WHERE deleted_at IS NULL ORDER BY id ASC
  `;
  return members as MemberOption[];
}

export async function selectProfile(memberId: number) {
  await createSession(memberId);
  redirect("/");
}
