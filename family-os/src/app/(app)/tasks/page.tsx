import { sql } from "@/lib/db";
import { ListChecks } from "lucide-react";
import { getCurrentMember } from "@/lib/currentMember";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

export default async function TasksPage() {
  const [tasks, members, me] = await Promise.all([
    sql`
      SELECT t.id, t.title, t.due_date, t.recurring, t.is_done, t.assigned_to, fm.name AS member_name, fm.emoji, fm.color
      FROM household_tasks t
      LEFT JOIN family_members fm ON fm.id = t.assigned_to
      WHERE t.deleted_at IS NULL
      ORDER BY t.is_done ASC, t.due_date ASC NULLS LAST
    `,
    sql`SELECT id, name, emoji FROM family_members WHERE deleted_at IS NULL ORDER BY id ASC`,
    getCurrentMember(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-lavender text-lavender-ink flex items-center justify-center shrink-0">
          <ListChecks size={20} />
        </div>
        <h1 className="text-xl font-extrabold tracking-tight">Household Tasks</h1>
      </div>

      <TaskForm members={members as { id: number; name: string; emoji: string }[]} />

      <TaskList
        tasks={
          tasks as {
            id: number;
            title: string;
            due_date: string | null;
            recurring: string;
            is_done: boolean;
            assigned_to: number | null;
            member_name: string | null;
            emoji: string | null;
            color: string | null;
          }[]
        }
        currentMemberId={me?.id ?? null}
      />
    </div>
  );
}
