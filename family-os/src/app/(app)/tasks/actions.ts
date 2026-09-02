"use server";

import { sql } from "@/lib/db";
import { getCurrentMember } from "@/lib/currentMember";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";

export async function addTask(input: {
  title: string;
  assignedTo: number | null;
  dueDate: string;
  recurring: string;
}) {
  const me = await getCurrentMember();
  if (!input.title.trim()) throw new Error("Title is required.");
  await sql`
    INSERT INTO household_tasks (title, assigned_to, due_date, recurring, created_by)
    VALUES (${input.title.trim()}, ${input.assignedTo}, ${input.dueDate || null}, ${input.recurring}, ${me?.id ?? null})
  `;
  await logActivity("added", "task", input.title.trim());
  revalidatePath("/tasks");
  revalidatePath("/");
}

export async function toggleTaskDone(id: number, done: boolean) {
  const rows = await sql`UPDATE household_tasks SET is_done = ${done} WHERE id = ${id} RETURNING title`;
  if (rows[0]) await logActivity(done ? "completed" : "reopened", "task", rows[0].title as string);
  revalidatePath("/tasks");
  revalidatePath("/");
}

export async function deleteTask(id: number) {
  const rows = await sql`UPDATE household_tasks SET deleted_at = now() WHERE id = ${id} RETURNING title`;
  if (rows[0]) await logActivity("deleted", "task", rows[0].title as string);
  revalidatePath("/tasks");
  revalidatePath("/");
  revalidatePath("/trash");
}

export async function restoreTask(id: number) {
  const rows = await sql`UPDATE household_tasks SET deleted_at = NULL WHERE id = ${id} RETURNING title`;
  if (rows[0]) await logActivity("restored", "task", rows[0].title as string);
  revalidatePath("/tasks");
  revalidatePath("/");
  revalidatePath("/trash");
}

export async function permanentlyDeleteTask(id: number) {
  await sql`DELETE FROM household_tasks WHERE id = ${id}`;
  revalidatePath("/trash");
}
