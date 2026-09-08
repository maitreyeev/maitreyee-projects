"use server";

import { sql } from "@/lib/db";
import { getCurrentHouseholdId } from "@/lib/currentHousehold";
import { getChild } from "@/lib/children";
import { revalidatePath } from "next/cache";

// All three return { error } instead of throwing — see login/actions.ts
// for why (Next.js redacts thrown Server Action error messages in
// production builds). These ownership checks should never actually fail
// for a legitimate user going through the normal UI (the pages
// themselves already gate access), but returning cleanly here means a
// stale session or race condition fails safely instead of surfacing a
// broken error client-side.

async function checkOwnership(childId: number): Promise<string | null> {
  const householdId = await getCurrentHouseholdId();
  if (!householdId) return "You've been signed out — please log in again.";
  const child = await getChild(householdId, childId);
  if (!child) return "That profile couldn't be found.";
  return null;
}

export async function toggleTopicDoneAction(childId: number, topicId: string): Promise<{ error?: string }> {
  const error = await checkOwnership(childId);
  if (error) return { error };

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
  return {};
}

export async function addJournalEntryAction(
  childId: number,
  input: { topicId: string; note: string; photo?: string }
): Promise<{ error?: string }> {
  const error = await checkOwnership(childId);
  if (error) return { error };
  if (!input.note.trim()) return { error: "Note can't be empty." };

  await sql`
    INSERT INTO journal_entries (child_id, topic_id, note, photo_data_url)
    VALUES (${childId}, ${input.topicId}, ${input.note.trim()}, ${input.photo ?? null})
  `;
  revalidatePath("/children/[childId]", "layout");
  return {};
}

export async function deleteJournalEntryAction(childId: number, entryId: number): Promise<{ error?: string }> {
  const error = await checkOwnership(childId);
  if (error) return { error };

  await sql`DELETE FROM journal_entries WHERE id = ${entryId} AND child_id = ${childId}`;
  revalidatePath("/children/[childId]", "layout");
  return {};
}
