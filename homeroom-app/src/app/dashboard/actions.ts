"use server";

import { sql } from "@/lib/db";
import { getCurrentHouseholdId } from "@/lib/currentHousehold";
import { revalidatePath } from "next/cache";
import type { BoardId } from "@/data/types";

export async function addChildAction(input: { name: string; age: number; boardId: BoardId }) {
  const householdId = await getCurrentHouseholdId();
  if (!householdId) throw new Error("Not signed in.");
  if (!input.name.trim()) throw new Error("Name is required.");
  await sql`
    INSERT INTO children (household_id, name, age, board_id)
    VALUES (${householdId}, ${input.name.trim()}, ${input.age}, ${input.boardId})
  `;
  revalidatePath("/dashboard");
}

export async function updateChildAction(childId: number, input: { age: number; boardId: BoardId }) {
  const householdId = await getCurrentHouseholdId();
  if (!householdId) throw new Error("Not signed in.");
  await sql`
    UPDATE children SET age = ${input.age}, board_id = ${input.boardId}
    WHERE id = ${childId} AND household_id = ${householdId}
  `;
  revalidatePath("/dashboard");
}

export async function removeChildAction(childId: number) {
  const householdId = await getCurrentHouseholdId();
  if (!householdId) throw new Error("Not signed in.");
  await sql`
    UPDATE children SET deleted_at = now()
    WHERE id = ${childId} AND household_id = ${householdId}
  `;
  revalidatePath("/dashboard");
}
