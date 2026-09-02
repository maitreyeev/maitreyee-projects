"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { Input, Label, Select } from "@/components/Input";
import { addMedicine } from "./actions";

export default function MedicineForm({ members }: { members: { id: number; name: string; emoji: string }[] }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [schedule, setSchedule] = useState("");
  const [refillDate, setRefillDate] = useState("");
  const [memberId, setMemberId] = useState<string>("");
  const [pending, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      await addMedicine({
        name,
        dosage,
        schedule,
        refillDate,
        notes: "",
        familyMemberId: memberId ? Number(memberId) : null,
      });
      setName("");
      setDosage("");
      setSchedule("");
      setRefillDate("");
      setMemberId("");
      setOpen(false);
    });
  }

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)} className="w-full">
        <Plus size={18} /> Add medicine
      </Button>
    );
  }

  return (
    <Card className="p-5 flex flex-col gap-3">
      <div>
        <Label>Medicine name</Label>
        <Input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Metformin" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Dosage</Label>
          <Input value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="e.g. 500mg" />
        </div>
        <div>
          <Label>Schedule</Label>
          <Input value={schedule} onChange={(e) => setSchedule(e.target.value)} placeholder="e.g. Twice daily" />
        </div>
      </div>
      <div>
        <Label>For</Label>
        <Select value={memberId} onChange={(e) => setMemberId(e.target.value)}>
          <option value="">Select family member</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.emoji} {m.name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label>Refill by (optional)</Label>
        <Input type="date" value={refillDate} onChange={(e) => setRefillDate(e.target.value)} />
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
