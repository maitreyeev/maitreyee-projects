"use server";

import { sql } from "@/lib/db";
import { hashSecret, verifySecret, createSession } from "@/lib/auth";
import type { BoardId } from "@/data/types";

// Returns { error } instead of throwing — see login/actions.ts for why.
export async function completeSignup(input: {
  childName: string;
  age: number;
  boardId: BoardId;
  passcode: string;
}): Promise<{ error?: string }> {
  if (!input.childName.trim()) return { error: "Your child's name is required." };
  if (input.passcode.length < 4) return { error: "Passcode must be at least 4 characters." };

  const existing = await sql`SELECT passcode_hash FROM households`;
  const collision = (existing as { passcode_hash: string }[]).some((h) =>
    verifySecret(input.passcode, h.passcode_hash)
  );
  if (collision) {
    return { error: "That passcode is already in use on this app — please choose a different one." };
  }

  const householdRows = await sql`
    INSERT INTO households (passcode_hash) VALUES (${hashSecret(input.passcode)}) RETURNING id
  `;
  const householdId = householdRows[0].id as number;

  await sql`
    INSERT INTO children (household_id, name, age, board_id)
    VALUES (${householdId}, ${input.childName.trim()}, ${input.age}, ${input.boardId})
  `;

  await createSession(householdId);
  return {};
}
