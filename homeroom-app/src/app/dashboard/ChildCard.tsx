"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { AlertTriangle, ChevronRight, Pencil, Sparkles, Trash2, X } from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { BOARDS, getBoard } from "@/data/boards";
import type { BoardId } from "@/data/types";
import type { ChildProgress } from "@/data/syllabus";
import { SUBJECT_STYLE } from "@/data/syllabus";
import { updateChildAction, removeChildAction } from "./actions";

interface ChildLike {
  id: number;
  name: string;
  age: number;
  boardId: BoardId;
}

const AGES = Array.from({ length: 14 }, (_, i) => i + 3);

export default function ChildCard({
  child,
  progress,
  journalCount,
}: {
  child: ChildLike;
  progress: ChildProgress;
  journalCount: number;
}) {
  const [mode, setMode] = useState<"view" | "edit" | "delete">("view");
  const [age, setAge] = useState(child.age);
  const [boardId, setBoardId] = useState<BoardId>(child.boardId);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const board = getBoard(child.boardId);
  const pct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;

  function saveEdit() {
    setError("");
    startTransition(async () => {
      const result = await updateChildAction(child.id, { age, boardId });
      if (result.error) setError(result.error);
      else setMode("view");
    });
  }

  function confirmDelete() {
    setError("");
    startTransition(async () => {
      const result = await removeChildAction(child.id);
      if (result.error) setError(result.error);
    });
  }

  if (mode === "delete") {
    return (
      <Card className="p-5 border-danger/40">
        <div className="flex items-start gap-3 mb-3">
          <div className="h-9 w-9 rounded-xl bg-danger-soft text-danger flex items-center justify-center shrink-0">
            <AlertTriangle size={16} />
          </div>
          <div>
            <h3 className="font-extrabold">Remove {child.name}?</h3>
            <p className="text-sm text-muted mt-1 leading-relaxed">
              This deletes {progress.done} completed {progress.done === 1 ? "topic" : "topics"} and{" "}
              {journalCount} journal {journalCount === 1 ? "entry" : "entries"} — permanently.
            </p>
          </div>
        </div>
        {error && <p className="text-sm text-danger mb-3">{error}</p>}
        <div className="flex gap-2.5">
          <Button variant="secondary" className="flex-1" onClick={() => setMode("view")} disabled={pending}>
            Cancel
          </Button>
          <Button variant="danger" className="flex-1" onClick={confirmDelete} disabled={pending}>
            {pending ? "Removing…" : "Yes, remove"}
          </Button>
        </div>
      </Card>
    );
  }

  if (mode === "edit") {
    return (
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold">Edit {child.name}</h3>
          <button
            aria-label="Cancel edit"
            onClick={() => {
              setMode("view");
              setAge(child.age);
              setBoardId(child.boardId);
              setError("");
            }}
            className="text-muted hover:text-foreground cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-muted mb-1.5 block">Age</label>
            <select
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full h-11 rounded-xl bg-surface-muted border border-border px-3 text-sm outline-none focus:border-accent"
            >
              {AGES.map((a) => (
                <option key={a} value={a}>
                  {a} years old
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-muted mb-1.5 block">Board</label>
            <select
              value={boardId}
              onChange={(e) => setBoardId(e.target.value as BoardId)}
              className="w-full h-11 rounded-xl bg-surface-muted border border-border px-3 text-sm outline-none focus:border-accent"
            >
              {BOARDS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <p className="text-xs text-muted leading-relaxed">
            Progress and journal entries are kept — only topics that no longer exist at the new age will stop
            showing (nothing is deleted).
          </p>
          <Button onClick={saveEdit} disabled={pending}>
            {pending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-11 w-11 rounded-xl bg-accent-soft text-accent flex items-center justify-center shrink-0 font-extrabold">
            {child.name.slice(0, 1).toUpperCase() || "?"}
          </div>
          <div className="min-w-0">
            <div className="font-extrabold truncate">{child.name}</div>
            <div className="text-sm text-muted">
              {board.name} · {board.gradeLabel(child.age)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            aria-label={`Edit ${child.name}`}
            onClick={() => setMode("edit")}
            className="h-9 w-9 rounded-xl flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-muted transition-colors cursor-pointer"
          >
            <Pencil size={15} />
          </button>
          <button
            aria-label={`Remove ${child.name}`}
            onClick={() => setMode("delete")}
            className="h-9 w-9 rounded-xl flex items-center justify-center text-muted hover:text-danger hover:bg-danger-soft transition-colors cursor-pointer"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-1">
        <div className="flex-1 h-2 rounded-full bg-surface-muted overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs font-bold text-muted shrink-0">
          {progress.done}/{progress.total} done
        </span>
      </div>
      <div className="flex items-center gap-1 text-xs text-muted mb-4">
        <Sparkles size={11} /> {progress.activitiesReady} of {progress.total} topics have an activity ready
      </div>

      <div className="flex flex-col gap-2 mb-4">
        {progress.subjects.map((s) => {
          const style = SUBJECT_STYLE[s.key];
          const subjectPct = s.total ? (s.done / s.total) * 100 : 0;
          return (
            <div key={s.key} className="flex items-center gap-2.5">
              <span className={`h-2 w-2 rounded-full shrink-0 ${style.dot}`} />
              <span className="text-xs font-medium w-32 shrink-0 truncate">{s.label}</span>
              <div className="flex-1 h-1.5 rounded-full bg-surface-muted overflow-hidden">
                <div className={`h-full rounded-full ${style.dot}`} style={{ width: `${subjectPct}%` }} />
              </div>
              <span className="text-xs text-muted shrink-0 w-8 text-right">
                {s.done}/{s.total}
              </span>
            </div>
          );
        })}
      </div>

      <Link
        href={`/children/${child.id}/syllabus`}
        className="flex items-center justify-center gap-1.5 h-11 rounded-full bg-surface-muted font-bold text-sm hover:bg-border/60 transition-colors"
      >
        Open syllabus <ChevronRight size={15} />
      </Link>
    </Card>
  );
}
