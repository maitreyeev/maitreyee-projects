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

// Returns { error } (or { members }) instead of throwing — see the
// comment on setup/actions.ts completeSetup for why: thrown Error
// messages from Server Actions get redacted in production builds.
export async function verifyPasscode(
  passcode: string
): Promise<{ error?: string; members?: MemberOption[] }> {
  const households = await sql`SELECT id, passcode_hash FROM household_auth`;
  const match = (households as { id: number; passcode_hash: string }[]).find((h) =>
    verifySecret(passcode, h.passcode_hash)
  );
  if (!match) {
    return { error: "That passcode isn't right." };
  }
  const members = await sql`
    SELECT id, name, role, emoji, color FROM family_members
    WHERE household_id = ${match.id} AND deleted_at IS NULL ORDER BY id ASC
  `;
  return { members: members as MemberOption[] };
}

export async function selectProfile(memberId: number): Promise<{ error?: string }> {
  const rows = await sql`SELECT household_id FROM family_members WHERE id = ${memberId} AND deleted_at IS NULL`;
  if (rows.length === 0) return { error: "Profile not found." };
  await createSession(memberId, rows[0].household_id as number);
  redirect("/");
}
