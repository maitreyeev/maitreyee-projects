"use client";

import { useState } from "react";
import Card from "@/components/Card";
import TaskRow from "./TaskRow";

interface Task {
  id: number;
  title: string;
  due_date: string | null;
  recurring: string;
  is_done: boolean;
  assigned_to: number | null;
  member_name: string | null;
  emoji: string | null;
  color: string | null;
}

export default function TaskList({ tasks, currentMemberId }: { tasks: Task[]; currentMemberId: number | null }) {
  const [mineOnly, setMineOnly] = useState(false);
  const filtered = mineOnly && currentMemberId ? tasks.filter((t) => t.assigned_to === currentMemberId) : tasks;

  return (
    <div className="flex flex-col gap-4">
      {currentMemberId && (
        <div className="flex rounded-full bg-surface-muted p-1 w-fit">
          {[
            { value: false, label: "All" },
            { value: true, label: "Mine" },
          ].map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => setMineOnly(opt.value)}
              className={`px-4 h-9 rounded-full text-sm font-bold cursor-pointer transition-colors ${
                mineOnly === opt.value ? "bg-ink text-ink-foreground" : "text-muted"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <Card className="p-6 text-center text-muted text-sm">
          {mineOnly ? "No tasks assigned to you." : "No tasks yet."}
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((t) => (
            <TaskRow key={t.id} task={t} />
          ))}
        </div>
      )}
    </div>
  );
}
