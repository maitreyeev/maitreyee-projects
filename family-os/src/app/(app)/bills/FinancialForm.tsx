"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { Input, Label, Select } from "@/components/Input";
import { addFinancialItem } from "./actions";

const TYPES = [
  { value: "bill", label: "Bill" },
  { value: "subscription", label: "Subscription" },
  { value: "insurance", label: "Insurance" },
  { value: "warranty", label: "Warranty" },
  { value: "obligation", label: "Loan / EMI" },
];

export default function FinancialForm() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("bill");
  const [title, setTitle] = useState("");
  const [provider, setProvider] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [recurring, setRecurring] = useState("monthly");
  const [pending, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      await addFinancialItem({ type, title, provider, amount, dueDate, recurring });
      setTitle("");
      setProvider("");
      setAmount("");
      setDueDate("");
      setOpen(false);
    });
  }

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)} className="w-full">
        <Plus size={18} /> Add bill, subscription, insurance…
      </Button>
    );
  }

  return (
    <Card className="p-5 flex flex-col gap-3">
      <div>
        <Label>Type</Label>
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label>Title</Label>
        <Input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Electricity bill" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Provider (optional)</Label>
          <Input value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="e.g. BESCOM" />
        </div>
        <div>
          <Label>Amount (₹)</Label>
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Due date</Label>
          <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        <div>
          <Label>Repeats</Label>
          <Select value={recurring} onChange={(e) => setRecurring(e.target.value)}>
            <option value="none">One-time</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </Select>
        </div>
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
