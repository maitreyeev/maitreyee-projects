"use server";

import { sql } from "@/lib/db";
import { getCurrentMember } from "@/lib/currentMember";
import { logActivity } from "@/lib/activity";
import { advanceDate } from "@/lib/dateMath";
import { revalidatePath } from "next/cache";

export async function addTask(input: {
  title: string;
  assignedTo: number | null;
  dueDate: string;
  recurring: string;
}) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  if (!input.title.trim()) throw new Error("Title is required.");
  await sql`
    INSERT INTO household_tasks (household_id, title, assigned_to, due_date, recurring, created_by)
    VALUES (${me.householdId}, ${input.title.trim()}, ${input.assignedTo}, ${input.dueDate || null}, ${input.recurring}, ${me.id})
  `;
  await logActivity("added", "task", input.title.trim());
  revalidatePath("/tasks");
  revalidatePath("/");
}

export async function toggleTaskDone(id: number, done: boolean) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");

  if (done) {
    const existing = await sql`
      SELECT title, due_date::text AS due_date, recurring FROM household_tasks
      WHERE id = ${id} AND household_id = ${me.householdId}
    `;
    const task = existing[0];
    if (!task) return;
    if (task.recurring !== "none" && task.due_date) {
      const nextDue = advanceDate(
        task.due_date as string,
        task.recurring as "daily" | "weekly" | "monthly"
      );
      await sql`
        UPDATE household_tasks SET due_date = ${nextDue}, is_done = false
        WHERE id = ${id} AND household_id = ${me.householdId}
      `;
      await logActivity("completed", "task", task.title as string);
      revalidatePath("/tasks");
      revalidatePath("/");
      return;
    }
    await sql`UPDATE household_tasks SET is_done = true WHERE id = ${id} AND household_id = ${me.householdId}`;
    await logActivity("completed", "task", task.title as string);
    revalidatePath("/tasks");
    revalidatePath("/");
    return;
  }

  const rows = await sql`
    UPDATE household_tasks SET is_done = false WHERE id = ${id} AND household_id = ${me.householdId} RETURNING title
  `;
  if (rows[0]) await logActivity("reopened", "task", rows[0].title as string);
  revalidatePath("/tasks");
  revalidatePath("/");
}

export async function deleteTask(id: number) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  const rows = await sql`
    UPDATE household_tasks SET deleted_at = now() WHERE id = ${id} AND household_id = ${me.householdId} RETURNING title
  `;
  if (rows[0]) await logActivity("deleted", "task", rows[0].title as string);
  revalidatePath("/tasks");
  revalidatePath("/");
  revalidatePath("/trash");
}

export async function restoreTask(id: number) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  const rows = await sql`
    UPDATE household_tasks SET deleted_at = NULL WHERE id = ${id} AND household_id = ${me.householdId} RETURNING title
  `;
  if (rows[0]) await logActivity("restored", "task", rows[0].title as string);
  revalidatePath("/tasks");
  revalidatePath("/");
  revalidatePath("/trash");
}

export async function permanentlyDeleteTask(id: number) {
  const me = await getCurrentMember();
  if (!me) throw new Error("Not signed in.");
  await sql`DELETE FROM household_tasks WHERE id = ${id} AND household_id = ${me.householdId}`;
  revalidatePath("/trash");
}
