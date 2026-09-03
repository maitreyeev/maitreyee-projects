"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, KeyRound, Sparkles } from "lucide-react";
import Button from "@/components/Button";
import { Input } from "@/components/Input";
import IndianHomeIcon from "@/components/IndianHomeIcon";
import { verifyPasscode, selectProfile, type MemberOption } from "./actions";

export default function LoginPage() {
  const [phase, setPhase] = useState<"passcode" | "profile">("passcode");
  const [passcode, setPasscode] = useState("");
  const [members, setMembers] = useState<MemberOption[]>([]);
  const [error, setError] = useState("");
  const [loading, startTransition] = useTransition();

  function submitPasscode() {
    setError("");
    startTransition(async () => {
      try {
        const result = await verifyPasscode(passcode);
        setMembers(result);
        setPhase("profile");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  function pick(memberId: number) {
    startTransition(async () => {
      await selectProfile(memberId);
    });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        {phase === "passcode" && (
          <div className="flex flex-col items-center text-center gap-6">
            <div className="h-16 w-16 rounded-3xl bg-ink flex items-center justify-center card-shadow-lg">
              <IndianHomeIcon size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Family OS</h1>
              <p className="text-muted mt-2">Enter your household passcode</p>
            </div>
            <div className="w-full">
              <Input
                autoFocus
                type="text"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitPasscode()}
                placeholder="Passcode"
                className="text-center text-lg"
              />
              {error && <p className="text-sm text-danger mt-3">{error}</p>}
              <Button size="lg" className="w-full mt-4" onClick={submitPasscode} disabled={loading || !passcode}>
                {loading ? "Checking…" : <>Continue <ArrowRight size={18} /></>}
              </Button>
            </div>
            <Link
              href="/setup"
              className="text-sm text-muted hover:text-foreground cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles size={13} /> New here? Set up your own household — it&apos;s free
            </Link>
          </div>
        )}

        {phase === "profile" && (
          <div className="flex flex-col items-center text-center gap-6">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Who&apos;s this?</h1>
              <p className="text-muted mt-2">Tap your profile</p>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full">
              {members.map((m) => (
                <button
                  key={m.id}
                  onClick={() => pick(m.id)}
                  disabled={loading}
                  className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-surface card-shadow hover:scale-105 active:scale-95 transition-transform cursor-pointer disabled:opacity-50"
                >
                  <div
                    className="h-14 w-14 rounded-full flex items-center justify-center text-2xl"
                    style={{ background: `${m.color}22` }}
                  >
                    {m.emoji}
                  </div>
                  <span className="text-sm font-bold truncate w-full">{m.name}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setPhase("passcode")}
              className="text-sm text-muted hover:text-foreground cursor-pointer flex items-center gap-1.5"
            >
              <KeyRound size={13} /> Not your household? Enter a different passcode
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
