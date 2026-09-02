import { sql } from "@/lib/db";
import { ListChecks } from "lucide-react";
import Card from "@/components/Card";
import TaskForm from "./TaskForm";
import TaskRow from "./TaskRow";

export default async function TasksPage() {
  const [tasks, members] = await Promise.all([
    sql`
      SELECT t.id, t.title, t.due_date, t.recurring, t.is_done, fm.name AS member_name, fm.emoji, fm.color
      FROM household_tasks t
      LEFT JOIN family_members fm ON fm.id = t.assigned_to
      ORDER BY t.is_done ASC, t.due_date ASC NULLS LAST
    `,
    sql`SELECT id, name, emoji FROM family_members ORDER BY id ASC`,
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

      {tasks.length === 0 ? (
        <Card className="p-6 text-center text-muted text-sm">No tasks yet.</Card>
      ) : (
        <div className="flex flex-col gap-3">
          {(tasks as {
            id: number;
            title: string;
            due_date: string | null;
            recurring: string;
            is_done: boolean;
            member_name: string | null;
            emoji: string | null;
            color: string | null;
          }[]).map((t) => (
            <TaskRow key={t.id} task={t} />
          ))}
        </div>
      )}
    </div>
  );
}
