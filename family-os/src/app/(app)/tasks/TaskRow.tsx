"use client";

import { useTransition } from "react";
import { Check } from "lucide-react";
import Card from "@/components/Card";
import SoftDeleteButton from "@/components/SoftDeleteButton";
import { deleteTask, toggleTaskDone } from "./actions";

interface Task {
  id: number;
  title: string;
  due_date: string | null;
  recurring: string;
  is_done: boolean;
  member_name: string | null;
  emoji: string | null;
  color: string | null;
}

export default function TaskRow({ task: t }: { task: Task }) {
  const [pending, startTransition] = useTransition();

  return (
    <Card className="p-4 flex items-center gap-3">
      <button
        onClick={() => startTransition(() => toggleTaskDone(t.id, !t.is_done))}
        disabled={pending}
        className={`h-7 w-7 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
          t.is_done ? "bg-success border-success text-white" : "border-border"
        }`}
        aria-label={t.is_done ? "Mark not done" : "Mark done"}
      >
        {t.is_done && <Check size={14} />}
      </button>
      <div className="flex-1 min-w-0">
        <div className={`font-bold text-sm truncate ${t.is_done ? "line-through text-muted" : ""}`}>{t.title}</div>
        <div className="text-xs text-muted truncate">
          {t.member_name ? `${t.emoji} ${t.member_name}` : "Anyone"}
          {t.due_date ? ` · Due ${new Date(t.due_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}` : ""}
          {t.recurring !== "none" ? ` · Repeats ${t.recurring}` : ""}
        </div>
      </div>
      <SoftDeleteButton onConfirm={() => deleteTask(t.id)} label="Delete task" />
    </Card>
  );
}
