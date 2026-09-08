"use server";

import { sql } from "@/lib/db";
import { getCurrentHouseholdId } from "@/lib/currentHousehold";
import { getChild } from "@/lib/children";
import { revalidatePath } from "next/cache";

async function assertOwnership(childId: number) {
  const householdId = await getCurrentHouseholdId();
  if (!householdId) throw new Error("Not signed in.");
  const child = await getChild(householdId, childId);
  if (!child) throw new Error("Not found.");
  return child;
}

export async function toggleTopicDoneAction(childId: number, topicId: string) {
  await assertOwnership(childId);
  const existing = await sql`
    SELECT id FROM completed_topics WHERE child_id = ${childId} AND topic_id = ${topicId}
  `;
  if (existing.length > 0) {
    await sql`DELETE FROM completed_topics WHERE child_id = ${childId} AND topic_id = ${topicId}`;
  } else {
    await sql`
      INSERT INTO completed_topics (child_id, topic_id) VALUES (${childId}, ${topicId})
      ON CONFLICT DO NOTHING
    `;
  }
  revalidatePath("/children/[childId]", "layout");
  revalidatePath("/dashboard");
}

export async function addJournalEntryAction(
  childId: number,
  input: { topicId: string; note: string; photo?: string }
) {
  await assertOwnership(childId);
  if (!input.note.trim()) throw new Error("Note can't be empty.");
  await sql`
    INSERT INTO journal_entries (child_id, topic_id, note, photo_data_url)
    VALUES (${childId}, ${input.topicId}, ${input.note.trim()}, ${input.photo ?? null})
  `;
  revalidatePath("/children/[childId]", "layout");
}

export async function deleteJournalEntryAction(childId: number, entryId: number) {
  await assertOwnership(childId);
  await sql`DELETE FROM journal_entries WHERE id = ${entryId} AND child_id = ${childId}`;
  revalidatePath("/children/[childId]", "layout");
}
