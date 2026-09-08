import { sql } from "./db";
import type { BoardId } from "@/data/types";

export interface Child {
  id: number;
  householdId: number;
  name: string;
  age: number;
  boardId: BoardId;
}

export interface JournalEntryRow {
  id: number;
  topicId: string;
  note: string;
  photo: string | null;
  createdAt: string;
}

function toChild(r: Record<string, unknown>): Child {
  return {
    id: r.id as number,
    householdId: r.household_id as number,
    name: r.name as string,
    age: r.age as number,
    boardId: r.board_id as BoardId,
  };
}

export async function getChildrenForHousehold(householdId: number): Promise<Child[]> {
  const rows = await sql`
    SELECT id, household_id, name, age, board_id FROM children
    WHERE household_id = ${householdId} AND deleted_at IS NULL ORDER BY id ASC
  `;
  return (rows as Record<string, unknown>[]).map(toChild);
}

export async function getChild(householdId: number, childId: number): Promise<Child | null> {
  const rows = await sql`
    SELECT id, household_id, name, age, board_id FROM children
    WHERE id = ${childId} AND household_id = ${householdId} AND deleted_at IS NULL
  `;
  if (rows.length === 0) return null;
  return toChild(rows[0] as Record<string, unknown>);
}

export async function getCompletedTopicIds(childId: number): Promise<string[]> {
  const rows = await sql`SELECT topic_id FROM completed_topics WHERE child_id = ${childId}`;
  return (rows as { topic_id: string }[]).map((r) => r.topic_id);
}

export async function getJournalEntries(childId: number): Promise<JournalEntryRow[]> {
  const rows = await sql`
    SELECT id, topic_id, note, photo_data_url, created_at FROM journal_entries
    WHERE child_id = ${childId} ORDER BY created_at DESC
  `;
  return (rows as Record<string, unknown>[]).map((r) => ({
    id: r.id as number,
    topicId: r.topic_id as string,
    note: r.note as string,
    photo: r.photo_data_url as string | null,
    createdAt: r.created_at as string,
  }));
}

export async function getJournalCount(childId: number): Promise<number> {
  const rows = await sql`SELECT count(*)::int AS n FROM journal_entries WHERE child_id = ${childId}`;
  return (rows[0] as { n: number }).n;
}
