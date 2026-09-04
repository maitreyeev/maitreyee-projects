"use server";

import { sql } from "@/lib/db";
import { getCurrentMember } from "@/lib/currentMember";
import { logActivity } from "@/lib/activity";
import { todayIST } from "@/lib/calendarEvents";
import { revalidatePath } from "next/cache";

export async function addStaff(input: {
  name: string;
  role: string;
  phone: string;
  monthlySalary: string;
  salaryDueDay: string;
  notes: string;
}) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  if (!input.name.trim()) throw new Error("Name is required.");
  const salary = input.monthlySalary ? Number(input.monthlySalary) : null;
  const dueDay = input.salaryDueDay ? Number(input.salaryDueDay) : null;
  await sql`
    INSERT INTO household_staff (household_id, name, role, phone, monthly_salary, salary_due_day, notes, created_by)
    VALUES (${me.householdId}, ${input.name.trim()}, ${input.role}, ${input.phone || null}, ${salary}, ${dueDay}, ${input.notes || null}, ${me.id})
  `;
  await logActivity("added", "staff member", input.name.trim());
  revalidatePath("/staff");
  revalidatePath("/");
}

export async function toggleStaffPaid(id: number, paid: boolean) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  const currentMonth = paid ? todayIST().slice(0, 7) : null;
  const rows = await sql`
    UPDATE household_staff SET salary_paid_month = ${currentMonth} WHERE id = ${id} AND household_id = ${me.householdId} RETURNING name
  `;
  if (rows[0]) await logActivity(paid ? "marked salary paid" : "marked salary unpaid", "staff member", rows[0].name as string);
  revalidatePath("/staff");
}

export async function deleteStaff(id: number) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  const rows = await sql`
    UPDATE household_staff SET deleted_at = now() WHERE id = ${id} AND household_id = ${me.householdId} RETURNING name
  `;
  if (rows[0]) await logActivity("removed", "staff member", rows[0].name as string);
  revalidatePath("/staff");
  revalidatePath("/");
  revalidatePath("/trash");
}

export async function restoreStaff(id: number) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  const rows = await sql`
    UPDATE household_staff SET deleted_at = NULL WHERE id = ${id} AND household_id = ${me.householdId} RETURNING name
  `;
  if (rows[0]) await logActivity("restored", "staff member", rows[0].name as string);
  revalidatePath("/staff");
  revalidatePath("/");
  revalidatePath("/trash");
}

export async function permanentlyDeleteStaff(id: number) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  await sql`DELETE FROM household_staff WHERE id = ${id} AND household_id = ${me.householdId}`;
  revalidatePath("/trash");
}
