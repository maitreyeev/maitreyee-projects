"use client";

import { useEffect, useState } from "react";
import { BellRing } from "lucide-react";
import Card from "@/components/Card";

type Status = "checking" | "unsupported" | "on" | "off" | "denied";

function urlBase64ToUint8Array(base64: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const base64Safe = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64Safe);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0))).buffer;
}

export default function PushToggle() {
  const [status, setStatus] = useState<Status>("checking");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    async function check() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setStatus("unsupported");
        return;
      }
      if (Notification.permission === "denied") {
        setStatus("denied");
        return;
      }
      const reg = await navigator.serviceWorker.register("/sw.js");
      const sub = await reg.pushManager.getSubscription();
      setStatus(sub ? "on" : "off");
    }
    check().catch(() => setStatus("unsupported"));
  }, []);

  async function enable() {
    setBusy(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "off");
        return;
      }
      const reg = await navigator.serviceWorker.register("/sw.js");
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
      });
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });
      setStatus("on");
    } catch {
      setStatus("off");
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setStatus("off");
    } finally {
      setBusy(false);
    }
  }

  if (status === "unsupported") return null;

  return (
    <Card className="p-5 flex items-center gap-3">
      <BellRing size={18} className="text-accent shrink-0" />
      <div className="flex-1 min-w-0">
        <h3 className="font-extrabold">Daily reminders</h3>
        <p className="text-xs text-muted">
          {status === "denied"
            ? "Blocked in your browser's site settings."
            : "A morning notification on this device for what's due today."}
        </p>
      </div>
      {status !== "denied" && (
        <button
          onClick={status === "on" ? disable : enable}
          disabled={busy || status === "checking"}
          className={`px-3 h-8 rounded-full text-xs font-bold cursor-pointer transition-colors shrink-0 ${
            status === "on" ? "bg-ink text-ink-foreground" : "bg-surface-muted text-muted"
          }`}
        >
          {status === "checking" ? "…" : status === "on" ? "On" : "Off"}
        </button>
      )}
    </Card>
  );
}
