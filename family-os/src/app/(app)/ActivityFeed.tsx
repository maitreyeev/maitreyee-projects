import Card from "@/components/Card";
import Avatar from "@/components/Avatar";
import { timeAgo, type ActivityEntry } from "@/lib/activity";

export default function ActivityFeed({ entries }: { entries: ActivityEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <Card className="p-5">
      <h2 className="font-extrabold mb-3">Recent activity</h2>
      <div className="flex flex-col gap-2.5">
        {entries.map((a) => (
          <div key={a.id} className="flex items-center gap-2.5 text-sm">
            <Avatar emoji={a.actor_emoji ?? "🙂"} size={24} />
            <span className="flex-1 min-w-0 truncate">
              <span className="font-bold">{a.actor_name ?? "Someone"}</span>{" "}
              <span className="text-muted">
                {a.action} {a.entity_type} — {a.entity_title}
              </span>
            </span>
            <span className="text-xs text-muted shrink-0">{timeAgo(a.created_at)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
