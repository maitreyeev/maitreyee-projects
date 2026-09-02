"use server";

import { sql } from "@/lib/db";
import { verifySecret, destroySession, getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function verifyParentPin(pin: string): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;
  const rows = await sql`SELECT parent_pin_hash FROM household_auth WHERE id = ${session.householdId}`;
  if (rows.length === 0) return false;
  return verifySecret(pin, rows[0].parent_pin_hash as string);
}

export async function logout() {
  await destroySession();
  redirect("/login");
}
