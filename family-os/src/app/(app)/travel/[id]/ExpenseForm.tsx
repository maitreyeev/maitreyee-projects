"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { Input, Label, Select } from "@/components/Input";
import { addExpense } from "../actions";

const CATEGORIES = ["Flights", "Stay", "Food", "Local transport", "Shopping", "Activities", "Other"];

export default function ExpenseForm({ tripId }: { tripId: number }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      await addExpense({ tripId, category, amount, date, notes });
      setAmount("");
      setDate("");
      setNotes("");
      setOpen(false);
    });
  }

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)} className="w-full">
        <Plus size={18} /> Add expense
      </Button>
    );
  }

  return (
    <Card className="p-5 flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Category</Label>
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Amount (₹)</Label>
          <Input
            autoFocus
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
          />
        </div>
      </div>
      <div>
        <Label>Date</Label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div>
        <Label>Notes</Label>
        <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" />
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" onClick={() => setOpen(false)} className="flex-1">
          Cancel
        </Button>
        <Button onClick={submit} disabled={pending || !(Number(amount) > 0)} className="flex-1">
          {pending ? "Saving…" : "Save"}
        </Button>
      </div>
    </Card>
  );
}
