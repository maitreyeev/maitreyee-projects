"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, Briefcase, Building2, History, Timer } from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";
import CompanyBadge from "@/components/CompanyBadge";
import Toggle from "@/components/Toggle";
import { COMPANIES, ROLE_OPTIONS } from "@/data";
import type { RoleKey } from "@/data/types";
import { emptySession, saveSession } from "@/lib/session";
import { loadHistory } from "@/lib/history";

type Step = "welcome" | "name" | "role" | "company" | "confirm";
const STEPS: Step[] = ["welcome", "name", "role", "company", "confirm"];

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("welcome");
  const [name, setName] = useState("");
  const [role, setRole] = useState<RoleKey | null>(null);
  const [companyId, setCompanyId] = useState<string>("");
  const [hasHistory, setHasHistory] = useState(false);
  const [timedMode, setTimedMode] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasHistory(loadHistory().length > 0);
  }, []);

  const stepIndex = STEPS.indexOf(step);
  const progress = (stepIndex / (STEPS.length - 1)) * 100;

  function next() {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  }
  function back() {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  }

  function startInterview() {
    if (!role || !companyId) return;
    saveSession({
      ...emptySession,
      name: name.trim(),
      companyId,
      role,
      timedMode,
    });
    router.push("/interview");
  }

  const selectedCompany = COMPANIES.find((c) => c.id === companyId);

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-10 pt-16 sm:pt-24">
      <div className="w-full max-w-md">
        {step !== "welcome" && (
          <div className="mb-8 flex items-center gap-3">
            <button
              onClick={back}
              className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-surface-muted transition-colors cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <ProgressBar value={progress} />
          </div>
        )}

        <AnimatePresence mode="popLayout" initial={false}>
          {step === "welcome" && (
            <StepShell key="welcome">
              <div className="flex flex-col items-center text-center gap-6 py-10">
                <div className="h-16 w-16 rounded-2xl bg-accent flex items-center justify-center card-shadow-lg">
                  <Sparkles size={28} className="text-accent-ink" />
                </div>
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight">
                    CrackIt
                  </h1>
                  <p className="text-muted mt-3 leading-relaxed">
                    Practice real PM &amp; Program Management interview
                    rounds from Google, Amazon, Meta, Microsoft, Apple,
                    Netflix, Qualcomm and Anthropic — with instant, structured
                    feedback built for Indian candidates.
                  </p>
                </div>
                <Button size="lg" className="w-full mt-2" onClick={next}>
                  Get started <ArrowRight size={18} />
                </Button>
                {hasHistory && (
                  <Button variant="ghost" size="sm" onClick={() => router.push("/history")}>
                    <History size={14} /> View past attempts
                  </Button>
                )}
              </div>
            </StepShell>
          )}

          {step === "name" && (
            <StepShell key="name">
              <Heading
                eyebrow="Step 1 of 3"
                title="What should we call you?"
                subtitle="This just personalizes your prep session."
              />
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && name.trim()) next();
                }}
                placeholder="Your name"
                className="w-full h-14 rounded-2xl bg-surface-muted border border-border px-5 text-lg outline-none focus:border-accent transition-colors"
              />
              <Button
                size="lg"
                className="w-full mt-6"
                disabled={!name.trim()}
                onClick={next}
              >
                Continue <ArrowRight size={18} />
              </Button>
            </StepShell>
          )}

          {step === "role" && (
            <StepShell key="role">
              <Heading
                eyebrow="Step 2 of 3"
                title={`Hey ${name.split(" ")[0]}, what role are you targeting?`}
              />
              <div className="flex flex-col gap-3">
                {ROLE_OPTIONS.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => {
                      setRole(r.key);
                      next();
                    }}
                    className="w-full text-left"
                  >
                    <Card
                      className={`p-5 flex items-center gap-4 transition-all hover:border-accent/50 cursor-pointer ${
                        role === r.key ? "border-accent" : ""
                      }`}
                    >
                      <div className="h-11 w-11 rounded-xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <div className="font-medium">{r.label}</div>
                        <div className="text-sm text-muted mt-0.5">
                          {r.key === "product_management"
                            ? "PM / APM tracks — product sense, execution, strategy"
                            : "TPM / Program Manager tracks — execution, systems, delivery"}
                        </div>
                      </div>
                    </Card>
                  </button>
                ))}
              </div>
            </StepShell>
          )}

          {step === "company" && (
            <StepShell key="company">
              <Heading
                eyebrow="Step 3 of 3"
                title="Which company are you preparing for?"
              />
              <div className="grid grid-cols-2 gap-3">
                {COMPANIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCompanyId(c.id);
                      next();
                    }}
                  >
                    <Card
                      className={`p-4 flex flex-col items-center gap-2.5 text-center hover:border-accent/50 transition-all cursor-pointer ${
                        companyId === c.id ? "border-accent" : ""
                      }`}
                    >
                      <CompanyBadge name={c.name} color={c.color} />
                      <span className="text-sm font-medium">{c.name}</span>
                    </Card>
                  </button>
                ))}
              </div>
            </StepShell>
          )}

          {step === "confirm" && selectedCompany && role && (
            <StepShell key="confirm">
              <Heading eyebrow="You're all set" title="Ready to begin?" />
              <Card className="p-6 flex flex-col gap-4">
                <Row label="Candidate" value={name} />
                <Row
                  label="Role"
                  value={
                    ROLE_OPTIONS.find((r) => r.key === role)?.label ?? ""
                  }
                />
                <Row
                  label="Company"
                  value={
                    <span className="flex items-center gap-2">
                      <CompanyBadge
                        name={selectedCompany.name}
                        color={selectedCompany.color}
                        size={24}
                      />
                      {selectedCompany.name}
                    </span>
                  }
                />
                <Row
                  label="Rounds"
                  value={`${selectedCompany.roles[role]?.rounds.length ?? 5} interview rounds`}
                />
              </Card>
              <div className="mt-5 flex items-start gap-2.5 text-sm text-muted bg-surface-muted rounded-2xl p-4">
                <Building2 size={16} className="shrink-0 mt-0.5" />
                <span>
                  You&apos;ll go through each round with real, commonly-asked
                  questions. Every answer gets scored instantly on structure,
                  specificity and length, and at the end you get a
                  selection-probability rating with what to fix.
                </span>
              </div>
              <div className="mt-3 flex items-center gap-3 bg-surface-muted rounded-2xl p-4">
                <div className="h-9 w-9 rounded-xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
                  <Timer size={17} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">Timed mode</div>
                  <div className="text-xs text-muted mt-0.5 leading-relaxed">
                    2 minutes per question, auto-submitted. Feedback is held until each round ends
                    — closer to real interview pressure.
                  </div>
                </div>
                <Toggle checked={timedMode} onChange={setTimedMode} label="Timed mode" />
              </div>
              <Button size="lg" className="w-full mt-6" onClick={startInterview}>
                Start interview <ArrowRight size={18} />
              </Button>
            </StepShell>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StepShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function Heading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <div className="text-xs font-medium uppercase tracking-wider text-accent mb-2">
        {eyebrow}
      </div>
      <h2 className="text-2xl font-semibold tracking-tight leading-tight">
        {title}
      </h2>
      {subtitle && <p className="text-muted mt-2">{subtitle}</p>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
