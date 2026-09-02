"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { Input, Label, Select, Textarea } from "@/components/Input";
import { addAppointment } from "./actions";

export default function AppointmentForm({ members }: { members: { id: number; name: string; emoji: string }[] }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [memberId, setMemberId] = useState<string>("");
  const [pending, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      await addAppointment({
        title,
        date,
        time,
        location,
        notes,
        familyMemberId: memberId ? Number(memberId) : null,
      });
      setTitle("");
      setDate("");
      setTime("");
      setLocation("");
      setNotes("");
      setMemberId("");
      setOpen(false);
    });
  }

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)} className="w-full">
        <Plus size={18} /> Add appointment
      </Button>
    );
  }

  return (
    <Card className="p-5 flex flex-col gap-3">
      <div>
        <Label>Title</Label>
        <Input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Dentist visit" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Date</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <Label>Time (optional)</Label>
          <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
      </div>
      <div>
        <Label>For</Label>
        <Select value={memberId} onChange={(e) => setMemberId(e.target.value)}>
          <option value="">Whole family</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.emoji} {m.name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label>Location (optional)</Label>
        <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Apollo Clinic" />
      </div>
      <div>
        <Label>Notes (optional)</Label>
        <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
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
