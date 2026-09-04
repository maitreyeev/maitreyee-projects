"use client";

import { MessageCircle } from "lucide-react";
import Button from "./Button";

export default function ShareWhatsAppButton({ text }: { text: string }) {
  function share() {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <Button variant="secondary" onClick={share} className="w-full">
      <MessageCircle size={18} /> Share this week via WhatsApp
    </Button>
  );
}
