"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { Input, Label } from "@/components/Input";
import { addImportantDate } from "./actions";

export default function DateForm() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [recurringYearly, setRecurringYearly] = useState(true);
  const [pending, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      await addImportantDate({ title, date, recurringYearly, notes: "" });
      setTitle("");
      setDate("");
      setRecurringYearly(true);
      setOpen(false);
    });
  }

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)} className="w-full">
        <Plus size={18} /> Add important date
      </Button>
    );
  }

  return (
    <Card className="p-5 flex flex-col gap-3">
      <div>
        <Label>What&apos;s the occasion?</Label>
        <Input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Amma's birthday" />
      </div>
      <div>
        <Label>Date</Label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
        <input
          type="checkbox"
          checked={recurringYearly}
          onChange={(e) => setRecurringYearly(e.target.checked)}
          className="h-4 w-4 accent-accent"
        />
        Repeats every year
      </label>
      <div className="flex gap-2">
        <Button variant="ghost" onClick={() => setOpen(false)} className="flex-1">
          Cancel
        </Button>
        <Button onClick={submit} disabled={pending || !title.trim() || !date} className="flex-1">
          {pending ? "Saving…" : "Save"}
        </Button>
      </div>
    </Card>
  );
}
