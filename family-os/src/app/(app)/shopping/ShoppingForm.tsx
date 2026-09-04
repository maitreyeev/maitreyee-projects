"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { Input, Label } from "@/components/Input";
import { addShoppingItem } from "./actions";

export default function ShoppingForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      await addShoppingItem({ name, quantity });
      setName("");
      setQuantity("");
    });
  }

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)} className="w-full">
        <Plus size={18} /> Add item
      </Button>
    );
  }

  return (
    <Card className="p-5 flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <Label>Item</Label>
          <Input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && name.trim() && submit()}
            placeholder="e.g. Milk"
          />
        </div>
        <div>
          <Label>Qty (optional)</Label>
          <Input
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && name.trim() && submit()}
            placeholder="2L"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" onClick={() => setOpen(false)} className="flex-1">
          Close
        </Button>
        <Button onClick={submit} disabled={pending || !name.trim()} className="flex-1">
          {pending ? "Adding…" : "Add to list"}
        </Button>
      </div>
    </Card>
  );
}
