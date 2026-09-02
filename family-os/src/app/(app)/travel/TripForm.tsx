"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { Input, Label } from "@/components/Input";
import { addTrip } from "./actions";

export default function TripForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      await addTrip({ name, destination, startDate, endDate });
      setName("");
      setDestination("");
      setStartDate("");
      setEndDate("");
      setOpen(false);
    });
  }

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)} className="w-full">
        <Plus size={18} /> Add trip
      </Button>
    );
  }

  return (
    <Card className="p-5 flex flex-col gap-3">
      <div>
        <Label>Trip name</Label>
        <Input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Goa summer trip" />
      </div>
      <div>
        <Label>Destination</Label>
        <Input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g. Goa, India" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Start date</Label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
          <Label>End date</Label>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
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
