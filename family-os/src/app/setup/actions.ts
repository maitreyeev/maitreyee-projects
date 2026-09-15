"use server";

import { sql } from "@/lib/db";
import { hashSecret, verifySecret, createSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export interface SetupMember {
  name: string;
  role: "parent" | "child" | "grandparent" | "other";
  emoji: string;
  color: string;
}

// Returns { error } instead of throwing for validation failures. Next.js's
// production build redacts the .message of any Error thrown from a Server
// Action — the client sees an opaque "Minified React error #441" instead
// of the real message, even though dev mode shows it fine (which is how
// this got past testing). Returning a plain value sidesteps that
// entirely. The redirect() on success is unaffected by this — it's a
// separate control-flow throw that Next's own runtime handles, not one
// this function's caller catches.
export async function completeSetup(input: {
  householdName: string;
  passcode: string;
  parentPin: string;
  members: SetupMember[];
}): Promise<{ error?: string }> {
  if (!input.householdName.trim()) return { error: "Household name is required." };
  if (input.passcode.length < 4) return { error: "Passcode must be at least 4 characters." };
  if (!/^\d{4,8}$/.test(input.parentPin)) return { error: "Parent PIN must be 4-8 digits." };
  if (input.members.length === 0) return { error: "Add at least one family member." };

  const existingHouseholds = await sql`SELECT passcode_hash FROM household_auth`;
  const collision = (existingHouseholds as { passcode_hash: string }[]).some((h) =>
    verifySecret(input.passcode, h.passcode_hash)
  );
  if (collision) {
    return { error: "That passcode is already used by another household on this app — please choose a different one." };
  }

  const householdRows = await sql`
    INSERT INTO household_auth (household_name, passcode_hash, parent_pin_hash)
    VALUES (${input.householdName.trim()}, ${hashSecret(input.passcode)}, ${hashSecret(input.parentPin)})
    RETURNING id
  `;
  const householdId = householdRows[0].id as number;

  let firstId: number | null = null;
  for (const member of input.members) {
    const rows = await sql`
      INSERT INTO family_members (household_id, name, role, emoji, color)
      VALUES (${householdId}, ${member.name.trim()}, ${member.role}, ${member.emoji}, ${member.color})
      RETURNING id
    `;
    if (firstId === null) firstId = rows[0].id as number;
  }

  if (firstId !== null) await createSession(firstId, householdId);
  redirect("/");
}
