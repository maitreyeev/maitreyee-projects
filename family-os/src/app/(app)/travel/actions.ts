"use server";

import { sql } from "@/lib/db";
import { getCurrentMember } from "@/lib/currentMember";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";

export async function addTrip(input: { name: string; destination: string; startDate: string; endDate: string }) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  if (!input.name.trim()) throw new Error("Trip name is required.");
  await sql`
    INSERT INTO travel_trips (household_id, name, destination, start_date, end_date, created_by)
    VALUES (${me.householdId}, ${input.name.trim()}, ${input.destination || null}, ${input.startDate || null}, ${input.endDate || null}, ${me.id})
  `;
  await logActivity("added", "trip", input.name.trim());
  revalidatePath("/travel");
}

export async function deleteTrip(id: number) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  const rows = await sql`
    UPDATE travel_trips SET deleted_at = now() WHERE id = ${id} AND household_id = ${me.householdId} RETURNING name
  `;
  if (rows[0]) await logActivity("deleted", "trip", rows[0].name as string);
  revalidatePath("/travel");
  revalidatePath("/trash");
}

export async function restoreTrip(id: number) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  const rows = await sql`
    UPDATE travel_trips SET deleted_at = NULL WHERE id = ${id} AND household_id = ${me.householdId} RETURNING name
  `;
  if (rows[0]) await logActivity("restored", "trip", rows[0].name as string);
  revalidatePath("/travel");
  revalidatePath("/trash");
}

export async function permanentlyDeleteTrip(id: number) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  await sql`DELETE FROM travel_trips WHERE id = ${id} AND household_id = ${me.householdId}`;
  revalidatePath("/trash");
}

export async function addExpense(input: { tripId: number; category: string; amount: string; date: string; notes: string }) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  const amount = Number(input.amount);
  if (!amount || amount <= 0) throw new Error("Enter a valid amount.");
  const trip = await sql`SELECT id FROM travel_trips WHERE id = ${input.tripId} AND household_id = ${me.householdId}`;
  if (trip.length === 0) throw new Error("Trip not found.");
  await sql`
    INSERT INTO travel_expenses (household_id, trip_id, category, amount, date, notes, created_by)
    VALUES (${me.householdId}, ${input.tripId}, ${input.category}, ${amount}, ${input.date || null}, ${input.notes || null}, ${me.id})
  `;
  revalidatePath(`/travel/${input.tripId}`);
}

export async function deleteExpense(id: number, tripId: number) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  await sql`DELETE FROM travel_expenses WHERE id = ${id} AND household_id = ${me.householdId}`;
  revalidatePath(`/travel/${tripId}`);
}
