"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { Input, Label, Select, Textarea } from "@/components/Input";
import { addStaff } from "./actions";

const ROLES = [
  { value: "maid", label: "Maid / Housekeeper" },
  { value: "cook", label: "Cook" },
  { value: "driver", label: "Driver" },
  { value: "nanny", label: "Nanny" },
  { value: "gardener", label: "Gardener" },
  { value: "cleaner", label: "Cleaner" },
  { value: "other", label: "Other" },
];

export default function StaffForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("maid");
  const [phone, setPhone] = useState("");
  const [monthlySalary, setMonthlySalary] = useState("");
  const [salaryDueDay, setSalaryDueDay] = useState("");
  const [notes, setNotes] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      await addStaff({ name, role, phone, monthlySalary, salaryDueDay, notes });
      setName("");
      setRole("maid");
      setPhone("");
      setMonthlySalary("");
      setSalaryDueDay("");
      setNotes("");
      setOpen(false);
    });
  }

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)} className="w-full">
        <Plus size={18} /> Add household help
      </Button>
    );
  }

  return (
    <Card className="p-5 flex flex-col gap-3">
      <div>
        <Label>Name</Label>
        <Input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Lakshmi" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Role</Label>
          <Select value={role} onChange={(e) => setRole(e.target.value)}>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Phone (optional)</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91…" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Monthly salary (₹)</Label>
          <Input type="number" value={monthlySalary} onChange={(e) => setMonthlySalary(e.target.value)} placeholder="0" />
        </div>
        <div>
          <Label>Salary due day</Label>
          <Input
            type="number"
            min={1}
            max={31}
            value={salaryDueDay}
            onChange={(e) => setSalaryDueDay(e.target.value)}
            placeholder="e.g. 5"
          />
        </div>
      </div>
      <div>
        <Label>Notes (optional)</Label>
        <Textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Leave pattern, timing, anything to remember"
        />
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" onClick={() => setOpen(false)} className="flex-1">
          Cancel
        </Button>
        <Button onClick={submit} disabled={pending || !name.trim()} className="flex-1">
          {pending ? "Saving…" : "Save"}
        </Button>
      </div>
    </Card>
  );
}
