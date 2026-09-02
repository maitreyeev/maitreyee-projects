import { sql } from "./db";
import { getSession } from "./auth";

export interface FamilyMember {
  id: number;
  householdId: number;
  name: string;
  role: "parent" | "child" | "grandparent" | "other";
  emoji: string;
  color: string;
}

export async function getCurrentMember(): Promise<FamilyMember | null> {
  const session = await getSession();
  if (!session) return null;
  const rows = await sql`
    SELECT id, household_id, name, role, emoji, color FROM family_members
    WHERE id = ${session.familyMemberId} AND household_id = ${session.householdId} AND deleted_at IS NULL
  `;
  if (rows.length === 0) return null;
  const r = rows[0];
  return {
    id: r.id as number,
    householdId: r.household_id as number,
    name: r.name as string,
    role: r.role as FamilyMember["role"],
    emoji: r.emoji as string,
    color: r.color as string,
  };
}
