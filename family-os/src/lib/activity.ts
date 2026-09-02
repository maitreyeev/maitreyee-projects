import { sql } from "./db";
import { getCurrentMember } from "./currentMember";

export async function logActivity(action: string, entityType: string, entityTitle: string) {
  const me = await getCurrentMember();
  await sql`
    INSERT INTO activity_log (actor_id, actor_name, actor_emoji, action, entity_type, entity_title)
    VALUES (${me?.id ?? null}, ${me?.name ?? null}, ${me?.emoji ?? null}, ${action}, ${entityType}, ${entityTitle})
  `;
}

export interface ActivityEntry {
  id: number;
  actor_name: string | null;
  actor_emoji: string | null;
  action: string;
  entity_type: string;
  entity_title: string;
  created_at: string;
}

export function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
