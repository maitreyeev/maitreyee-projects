"use server";

import { sql } from "@/lib/db";
import { getCurrentHouseholdId } from "@/lib/currentHousehold";
import { revalidatePath } from "next/cache";
import type { BoardId } from "@/data/types";

// All three return { error } instead of throwing — see login/actions.ts
// for why (Next.js redacts thrown Server Action error messages in
// production builds).

export async function addChildAction(input: {
  name: string;
  age: number;
  boardId: BoardId;
}): Promise<{ error?: string }> {
  const householdId = await getCurrentHouseholdId();
  if (!householdId) return { error: "You've been signed out — please log in again." };
  if (!input.name.trim()) return { error: "Name is required." };
  await sql`
    INSERT INTO children (household_id, name, age, board_id)
    VALUES (${householdId}, ${input.name.trim()}, ${input.age}, ${input.boardId})
  `;
  revalidatePath("/dashboard");
  return {};
}

export async function updateChildAction(
  childId: number,
  input: { age: number; boardId: BoardId }
): Promise<{ error?: string }> {
  const householdId = await getCurrentHouseholdId();
  if (!householdId) return { error: "You've been signed out — please log in again." };
  await sql`
    UPDATE children SET age = ${input.age}, board_id = ${input.boardId}
    WHERE id = ${childId} AND household_id = ${householdId}
  `;
  revalidatePath("/dashboard");
  return {};
}

export async function removeChildAction(childId: number): Promise<{ error?: string }> {
  const householdId = await getCurrentHouseholdId();
  if (!householdId) return { error: "You've been signed out — please log in again." };
  await sql`
    UPDATE children SET deleted_at = now()
    WHERE id = ${childId} AND household_id = ${householdId}
  `;
  revalidatePath("/dashboard");
  return {};
}
