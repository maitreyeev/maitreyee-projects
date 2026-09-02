"use server";

import { sql } from "@/lib/db";
import { getCurrentMember } from "@/lib/currentMember";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";

export async function addTrip(input: { name: string; destination: string; startDate: string; endDate: string }) {
  const me = await getCurrentMember();
  if (!input.name.trim()) throw new Error("Trip name is required.");
  await sql`
    INSERT INTO travel_trips (name, destination, start_date, end_date, created_by)
    VALUES (${input.name.trim()}, ${input.destination || null}, ${input.startDate || null}, ${input.endDate || null}, ${me?.id ?? null})
  `;
  await logActivity("added", "trip", input.name.trim());
  revalidatePath("/travel");
}

export async function deleteTrip(id: number) {
  const rows = await sql`UPDATE travel_trips SET deleted_at = now() WHERE id = ${id} RETURNING name`;
  if (rows[0]) await logActivity("deleted", "trip", rows[0].name as string);
  revalidatePath("/travel");
  revalidatePath("/trash");
}

export async function restoreTrip(id: number) {
  const rows = await sql`UPDATE travel_trips SET deleted_at = NULL WHERE id = ${id} RETURNING name`;
  if (rows[0]) await logActivity("restored", "trip", rows[0].name as string);
  revalidatePath("/travel");
  revalidatePath("/trash");
}

export async function permanentlyDeleteTrip(id: number) {
  await sql`DELETE FROM travel_trips WHERE id = ${id}`;
  revalidatePath("/trash");
}

export async function addExpense(input: { tripId: number; category: string; amount: string; date: string; notes: string }) {
  const me = await getCurrentMember();
  const amount = Number(input.amount);
  if (!amount || amount <= 0) throw new Error("Enter a valid amount.");
  await sql`
    INSERT INTO travel_expenses (trip_id, category, amount, date, notes, created_by)
    VALUES (${input.tripId}, ${input.category}, ${amount}, ${input.date || null}, ${input.notes || null}, ${me?.id ?? null})
  `;
  revalidatePath(`/travel/${input.tripId}`);
}

export async function deleteExpense(id: number, tripId: number) {
  await sql`DELETE FROM travel_expenses WHERE id = ${id}`;
  revalidatePath(`/travel/${tripId}`);
}
