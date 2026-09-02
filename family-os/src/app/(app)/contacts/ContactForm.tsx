"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { Input, Label } from "@/components/Input";
import { addContact } from "./actions";

export default function ContactForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [phone, setPhone] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      await addContact({ name, relation, phone, notes: "" });
      setName("");
      setRelation("");
      setPhone("");
      setOpen(false);
    });
  }

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)} className="w-full">
        <Plus size={18} /> Add contact
      </Button>
    );
  }

  return (
    <Card className="p-5 flex flex-col gap-3">
      <div>
        <Label>Name</Label>
        <Input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Dr. Rao" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Relation</Label>
          <Input value={relation} onChange={(e) => setRelation(e.target.value)} placeholder="e.g. Family doctor" />
        </div>
        <div>
          <Label>Phone</Label>
          <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91…" />
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" onClick={() => setOpen(false)} className="flex-1">
          Cancel
        </Button>
        <Button onClick={submit} disabled={pending || !name.trim() || !phone.trim()} className="flex-1">
          {pending ? "Saving…" : "Save"}
        </Button>
      </div>
    </Card>
  );
}
