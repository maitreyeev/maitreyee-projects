"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { Input, Label, Select } from "@/components/Input";
import { addTask } from "./actions";

const PRESETS: { label: string; title: string; recurring: string }[] = [
  { label: "Book LPG Cylinder", title: "Book LPG cylinder refill", recurring: "monthly" },
  { label: "Book Water Tanker", title: "Book water tanker", recurring: "monthly" },
  { label: "Vehicle Service", title: "Vehicle service due", recurring: "none" },
];

export default function TaskForm({ members }: { members: { id: number; name: string; emoji: string }[] }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [recurring, setRecurring] = useState("none");
  const [pending, startTransition] = useTransition();

  function applyPreset(p: (typeof PRESETS)[number]) {
    setTitle(p.title);
    setRecurring(p.recurring);
  }

  function submit() {
    startTransition(async () => {
      await addTask({ title, assignedTo: assignedTo ? Number(assignedTo) : null, dueDate, recurring });
      setTitle("");
      setAssignedTo("");
      setDueDate("");
      setRecurring("none");
      setOpen(false);
    });
  }

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)} className="w-full">
        <Plus size={18} /> Add task
      </Button>
    );
  }

  return (
    <Card className="p-5 flex flex-col gap-3">
      <div>
        <Label>Quick add</Label>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyPreset(p)}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-surface-muted hover:bg-border/60 transition-colors cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <Label>Task</Label>
        <Input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Water the plants" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Assign to</Label>
          <Select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
            <option value="">Anyone</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.emoji} {m.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Repeats</Label>
          <Select value={recurring} onChange={(e) => setRecurring(e.target.value)}>
            <option value="none">Once</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </Select>
        </div>
      </div>
      <div>
        <Label>Due date (optional)</Label>
        <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" onClick={() => setOpen(false)} className="flex-1">
          Cancel
        </Button>
        <Button onClick={submit} disabled={pending || !title.trim()} className="flex-1">
          {pending ? "Saving…" : "Save"}
        </Button>
      </div>
    </Card>
  );
}
