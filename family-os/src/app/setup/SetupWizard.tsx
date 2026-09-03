"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Lock, KeyRound, Users, Plus, X, Check } from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { Input, Label, Select } from "@/components/Input";
import Avatar from "@/components/Avatar";
import { completeSetup, type SetupMember } from "./actions";

type Step = "welcome" | "name" | "passcode" | "pin" | "members" | "review";
const STEPS: Step[] = ["welcome", "name", "passcode", "pin", "members", "review"];

const EMOJIS = ["👨🏽", "👩🏽", "👴🏽", "👵🏽", "👦🏽", "👧🏽"];
const COLORS = [
  { name: "lavender", hex: "#8B7CF6" },
  { name: "peach", hex: "#E0873E" },
  { name: "mint", hex: "#2CA97A" },
  { name: "sky", hex: "#3E8FD1" },
  { name: "butter", hex: "#C79A1E" },
  { name: "blush", hex: "#C9578A" },
];

export default function SetupWizard() {
  const [step, setStep] = useState<Step>("welcome");
  const [householdName, setHouseholdName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [passcodeConfirm, setPasscodeConfirm] = useState("");
  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [members, setMembers] = useState<SetupMember[]>([]);
  const [draftName, setDraftName] = useState("");
  const [draftRole, setDraftRole] = useState<SetupMember["role"]>("parent");
  const [draftEmoji, setDraftEmoji] = useState(EMOJIS[0]);
  const [draftColor, setDraftColor] = useState(COLORS[0].hex);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const stepIndex = STEPS.indexOf(step);
  const progress = (stepIndex / (STEPS.length - 1)) * 100;

  function next() {
    setError("");
    if (step === "name" && !householdName.trim()) return setError("Give your household a name.");
    if (step === "passcode") {
      if (passcode.length < 4) return setError("Passcode must be at least 4 characters.");
      if (passcode !== passcodeConfirm) return setError("Passcodes don't match.");
    }
    if (step === "pin") {
      if (!/^\d{4,8}$/.test(pin)) return setError("PIN must be 4-8 digits.");
      if (pin !== pinConfirm) return setError("PINs don't match.");
    }
    if (step === "members" && members.length === 0) return setError("Add at least one family member.");
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  }
  function back() {
    setError("");
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  }

  function addMember() {
    if (!draftName.trim()) return;
    setMembers((m) => [...m, { name: draftName.trim(), role: draftRole, emoji: draftEmoji, color: draftColor }]);
    setDraftName("");
    setDraftRole("parent");
    setDraftEmoji(EMOJIS[0]);
    setDraftColor(COLORS[0].hex);
  }

  async function finish() {
    setSubmitting(true);
    setError("");
    try {
      await completeSetup({ householdName, passcode, parentPin: pin, members });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-10 pt-16 sm:pt-20">
      <div className="w-full max-w-md">
        {step !== "welcome" && (
          <div className="mb-8 flex items-center gap-3">
            <button
              onClick={back}
              className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-surface-muted transition-colors cursor-pointer shrink-0"
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="h-2 flex-1 rounded-full bg-surface-muted overflow-hidden">
              <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <>
          {step === "welcome" && (
            <Step key="welcome">
              <div className="flex flex-col items-center text-center gap-6 py-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/house-icon.png" alt="" className="h-28 w-auto" />
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight">Family OS</h1>
                  <p className="text-muted mt-3 leading-relaxed">
                    One free, private place for your whole household — appointments, documents,
                    bills, medicines, and more. Takes about two minutes to set up.
                  </p>
                </div>
                <Button size="lg" className="w-full mt-2" onClick={next}>
                  Get started <ArrowRight size={18} />
                </Button>
                <Link href="/login" className="text-sm text-muted hover:text-foreground flex items-center gap-1.5">
                  <KeyRound size={13} /> Already have a household? Log in
                </Link>
              </div>
            </Step>
          )}

          {step === "name" && (
            <Step key="name">
              <Heading eyebrow="Step 1 of 5" title="What's your household called?" subtitle="e.g. “The Sharmas” or “221 MG Road”" />
              <Input
                autoFocus
                value={householdName}
                onChange={(e) => setHouseholdName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && next()}
                placeholder="Household name"
              />
              {error && <ErrorText text={error} />}
              <Button size="lg" className="w-full mt-5" onClick={next}>
                Continue <ArrowRight size={18} />
              </Button>
            </Step>
          )}

          {step === "passcode" && (
            <Step key="passcode">
              <Heading
                eyebrow="Step 2 of 5"
                title="Set a household passcode"
                subtitle="Everyone in the family will use this to open the app. Choose something easy to share but not obvious."
              />
              <div className="flex flex-col gap-3">
                <div>
                  <Label>Passcode</Label>
                  <Input
                    autoFocus
                    type="text"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="At least 4 characters"
                  />
                </div>
                <div>
                  <Label>Confirm passcode</Label>
                  <Input
                    type="text"
                    value={passcodeConfirm}
                    onChange={(e) => setPasscodeConfirm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && next()}
                    placeholder="Type it again"
                  />
                </div>
              </div>
              {error && <ErrorText text={error} />}
              <Button size="lg" className="w-full mt-5" onClick={next}>
                Continue <ArrowRight size={18} />
              </Button>
            </Step>
          )}

          {step === "pin" && (
            <Step key="pin">
              <Heading
                eyebrow="Step 3 of 5"
                title="Set a parent PIN"
                subtitle="A separate, shorter PIN required to delete anything. Only share this with parents/guardians."
              />
              <div className="flex flex-col gap-3">
                <div>
                  <Label>Parent PIN (4-8 digits)</Label>
                  <Input
                    autoFocus
                    type="text"
                    inputMode="numeric"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                    placeholder="e.g. 4821"
                  />
                </div>
                <div>
                  <Label>Confirm PIN</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={pinConfirm}
                    onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, ""))}
                    onKeyDown={(e) => e.key === "Enter" && next()}
                    placeholder="Type it again"
                  />
                </div>
              </div>
              {error && <ErrorText text={error} />}
              <Button size="lg" className="w-full mt-5" onClick={next}>
                Continue <ArrowRight size={18} />
              </Button>
            </Step>
          )}

          {step === "members" && (
            <Step key="members">
              <Heading eyebrow="Step 4 of 5" title="Add your family" subtitle="Add yourself first, then everyone else — kids and grandparents too." />

              {members.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {members.map((m, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full bg-surface-muted border border-border text-sm"
                    >
                      <Avatar emoji={m.emoji} size={24} />
                      {m.name}
                      <button
                        onClick={() => setMembers((ms) => ms.filter((_, j) => j !== i))}
                        className="h-5 w-5 rounded-full flex items-center justify-center hover:bg-border/60 cursor-pointer"
                        aria-label={`Remove ${m.name}`}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <Card className="p-4 flex flex-col gap-3">
                <Input
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="Name"
                />
                <Select value={draftRole} onChange={(e) => setDraftRole(e.target.value as SetupMember["role"])}>
                  <option value="parent">Parent / Guardian</option>
                  <option value="child">Child</option>
                  <option value="grandparent">Grandparent</option>
                  <option value="other">Other</option>
                </Select>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex gap-1.5">
                    {EMOJIS.map((e) => (
                      <button
                        key={e}
                        onClick={() => setDraftEmoji(e)}
                        className={`p-1 rounded-xl flex items-center justify-center cursor-pointer transition-all ${
                          draftEmoji === e ? "bg-accent-soft ring-2 ring-accent" : "hover:bg-surface-muted"
                        }`}
                      >
                        <Avatar emoji={e} size={36} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => setDraftColor(c.hex)}
                      aria-label={c.name}
                      className="h-8 w-8 rounded-full cursor-pointer transition-transform flex items-center justify-center"
                      style={{ background: c.hex, transform: draftColor === c.hex ? "scale(1.15)" : "scale(1)" }}
                    >
                      {draftColor === c.hex && <Check size={14} className="text-white" />}
                    </button>
                  ))}
                </div>
                <Button variant="secondary" onClick={addMember} disabled={!draftName.trim()}>
                  <Plus size={16} /> Add to family
                </Button>
              </Card>

              {error && <ErrorText text={error} />}
              <Button size="lg" className="w-full mt-5" onClick={next}>
                Continue <ArrowRight size={18} />
              </Button>
            </Step>
          )}

          {step === "review" && (
            <Step key="review">
              <Heading eyebrow="Step 5 of 5" title="Ready to go?" subtitle="Here's your household." />
              <Card className="p-6 flex flex-col gap-4">
                <Row label="Household" value={householdName} />
                <Row
                  label="Family members"
                  value={
                    <div className="flex flex-wrap gap-2 justify-end">
                      {members.map((m, i) => (
                        <div key={i} title={m.name}>
                          <Avatar emoji={m.emoji} size={28} />
                        </div>
                      ))}
                    </div>
                  }
                />
              </Card>
              <div className="mt-4 flex items-start gap-2.5 text-sm text-muted bg-surface-muted rounded-2xl p-4">
                <Lock size={16} className="shrink-0 mt-0.5" />
                <span>Your passcode and PIN are stored securely — not even I can see them once set.</span>
              </div>
              {error && <ErrorText text={error} />}
              <Button size="lg" className="w-full mt-5" onClick={finish} disabled={submitting}>
                {submitting ? "Setting up…" : <>Finish setup <KeyRound size={18} /></>}
              </Button>
            </Step>
          )}
        </>
      </div>
    </div>
  );
}

function Step({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

function Heading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent mb-2">
        <Users size={12} /> {eyebrow}
      </div>
      <h2 className="text-2xl font-extrabold tracking-tight leading-tight">{title}</h2>
      {subtitle && <p className="text-muted mt-2 leading-relaxed text-sm">{subtitle}</p>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-muted">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function ErrorText({ text }: { text: string }) {
  return <p className="text-sm text-danger mt-3">{text}</p>;
}
