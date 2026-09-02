import { sql } from "./db";
import { getSession } from "./auth";

export interface FamilyMember {
  id: number;
  name: string;
  role: "parent" | "child" | "grandparent" | "other";
  emoji: string;
  color: string;
}

export async function getCurrentMember(): Promise<FamilyMember | null> {
  const session = await getSession();
  if (!session) return null;
  const rows = await sql`
    SELECT id, name, role, emoji, color FROM family_members WHERE id = ${session.familyMemberId}
  `;
  return (rows[0] as FamilyMember) ?? null;
}
