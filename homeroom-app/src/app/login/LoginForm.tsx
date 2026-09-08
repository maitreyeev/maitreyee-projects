"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Sparkles, Sprout } from "lucide-react";
import Button from "@/components/Button";
import { verifyPasscode } from "./actions";

export default function LoginForm() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, startTransition] = useTransition();

  function submit() {
    setError("");
    startTransition(async () => {
      const result = await verifyPasscode(passcode);
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/dashboard");
      }
    });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-md flex flex-col items-center text-center gap-6">
        <div className="h-16 w-16 rounded-2xl bg-accent flex items-center justify-center card-shadow-lg">
          <Sprout size={30} className="text-accent-ink" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Homeroom</h1>
          <p className="text-muted mt-2">Enter your household passcode</p>
        </div>
        <div className="w-full">
          <input
            autoFocus
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && passcode && submit()}
            placeholder="Passcode"
            className="w-full h-14 rounded-2xl bg-surface-muted border border-border px-5 text-lg text-center outline-none focus:border-accent transition-colors"
          />
          {error && <p className="text-sm text-danger mt-3">{error}</p>}
          <Button size="lg" className="w-full mt-4" onClick={submit} disabled={loading || !passcode}>
            {loading ? "Checking…" : <>Continue <ArrowRight size={18} /></>}
          </Button>
        </div>
        <Link
          href="/signup"
          className="text-sm text-muted hover:text-foreground cursor-pointer flex items-center gap-1.5"
        >
          <Sparkles size={13} /> New here? Set up your household — it&apos;s free
        </Link>
      </div>
    </div>
  );
}
