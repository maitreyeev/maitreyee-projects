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

export async function completeSetup(input: {
  householdName: string;
  passcode: string;
  parentPin: string;
  members: SetupMember[];
}) {
  if (!input.householdName.trim()) throw new Error("Household name is required.");
  if (input.passcode.length < 4) throw new Error("Passcode must be at least 4 characters.");
  if (!/^\d{4,8}$/.test(input.parentPin)) throw new Error("Parent PIN must be 4-8 digits.");
  if (input.members.length === 0) throw new Error("Add at least one family member.");

  const existingHouseholds = await sql`SELECT passcode_hash FROM household_auth`;
  const collision = (existingHouseholds as { passcode_hash: string }[]).some((h) =>
    verifySecret(input.passcode, h.passcode_hash)
  );
  if (collision) {
    throw new Error("That passcode is already used by another household on this app — please choose a different one.");
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
