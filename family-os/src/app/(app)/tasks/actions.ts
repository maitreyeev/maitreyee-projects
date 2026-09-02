"use server";

import { sql } from "@/lib/db";
import { getCurrentMember } from "@/lib/currentMember";
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
  revalidatePath("/tasks");
  revalidatePath("/");
}

export async function toggleTaskDone(id: number, done: boolean) {
  await sql`UPDATE household_tasks SET is_done = ${done} WHERE id = ${id}`;
  revalidatePath("/tasks");
  revalidatePath("/");
}

export async function deleteTask(id: number) {
  await sql`DELETE FROM household_tasks WHERE id = ${id}`;
  revalidatePath("/tasks");
  revalidatePath("/");
}
