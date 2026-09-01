"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { RotateCcw, Sparkles, Home, TrendingUp, TrendingDown, Minus, ShieldCheck, Target, History } from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import ScoreRing from "@/components/ScoreRing";
import CompanyBadge from "@/components/CompanyBadge";
import { getCompany, getRoleTrack } from "@/data";
import { clearSession, loadSession, saveSession, type SessionState } from "@/lib/session";

const BAND_COPY: Record<string, { label: string; color: string }> = {
  "not-ready": { label: "Not ready yet", color: "var(--danger)" },
  developing: { label: "Developing", color: "var(--warning)" },
  close: { label: "Close", color: "var(--warning)" },
  ready: { label: "Interview ready", color: "var(--success)" },
};

export default function ResultsPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionState | null>(null);

  useEffect(() => {
    // One-time hydration from localStorage (an external system) on mount.
    const s = loadSession();
    if (!s.finalVerdict) {
      router.replace("/");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(s);
  }, [router]);

  if (!session || !session.finalVerdict || !session.role) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Sparkles size={22} className="text-accent animate-pulse" />
      </div>
    );
  }

  const company = getCompany(session.companyId);
  const roleTrack = getRoleTrack(session.companyId, session.role);
  const v = session.finalVerdict;
  const band = BAND_COPY[v.band] ?? BAND_COPY.developing;

  function retryWeakRounds() {
    if (!session) return;
    const next: SessionState = {
      ...session,
      attempt: session.attempt + 1,
      results: [],
      currentRoundIndex: 0,
      currentQuestionIndex: 0,
      finalVerdict: null,
    };
    saveSession(next);
    router.push("/interview");
  }

  function startOver() {
    clearSession();
    router.push("/");
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-10">
      <div className="w-full max-w-lg flex flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center text-center gap-4"
        >
          {company && (
            <div className="flex items-center gap-2 text-sm text-muted">
              <CompanyBadge name={company.name} color={company.color} size={22} />
              {company.name} · {roleTrack?.displayRole}
            </div>
          )}
          <ScoreRing
            value={v.probability}
            label={`${v.probability}%`}
            sublabel="selection probability"
            color={band.color}
            size={180}
          />
          <span
            className="text-xs font-medium uppercase tracking-wider px-3 py-1 rounded-full"
            style={{ background: `${band.color}1a`, color: band.color }}
          >
            {band.label}
          </span>
          {typeof session.previousProbability === "number" && (
            <TrendBadge current={v.probability} previous={session.previousProbability} />
          )}
          <h1 className="text-2xl font-semibold tracking-tight leading-snug max-w-sm">
            {v.headline}
          </h1>
          <p className="text-muted text-sm leading-relaxed max-w-md">{v.summary}</p>
        </motion.div>

        <Card className="p-6">
          <div className="flex items-center gap-2 text-sm font-medium mb-4">
            <TrendingUp size={16} className="text-accent" /> Round-by-round
          </div>
          <div className="flex flex-col gap-4">
            {v.roundBreakdown.map((r, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium">{r.roundName}</span>
                  <span className="text-muted">{r.score}/10</span>
                </div>
                <div className="h-1.5 rounded-full bg-surface-muted overflow-hidden mb-1.5">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${r.score * 10}%`,
                      background:
                        r.score >= 8 ? "var(--success)" : r.score >= 5 ? "var(--warning)" : "var(--danger)",
                    }}
                  />
                </div>
                <p className="text-xs text-muted leading-relaxed">{r.note}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          {v.topStrengths.length > 0 && (
            <>
              <div className="flex items-center gap-2 text-sm font-medium mb-3 text-success">
                <ShieldCheck size={16} /> Keep leaning on
              </div>
              <ul className="flex flex-col gap-1.5 mb-5">
                {v.topStrengths.map((s, i) => (
                  <li key={i} className="text-sm leading-relaxed">
                    · {s}
                  </li>
                ))}
              </ul>
            </>
          )}
          {v.priorityFixes.length > 0 && (
            <>
              <div className="flex items-center gap-2 text-sm font-medium mb-3 text-danger">
                <Target size={16} /> Fix before the real thing
              </div>
              <ul className="flex flex-col gap-1.5">
                {v.priorityFixes.map((s, i) => (
                  <li key={i} className="text-sm leading-relaxed">
                    · {s}
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>

        <div className="flex flex-col gap-3">
          <Button size="lg" onClick={retryWeakRounds}>
            <RotateCcw size={16} /> Retry with new questions
          </Button>
          <Button size="lg" variant="secondary" onClick={() => router.push("/history")}>
            <History size={16} /> View past attempts
          </Button>
          <Button size="lg" variant="ghost" onClick={startOver}>
            <Home size={16} /> Start a new session
          </Button>
        </div>
      </div>
    </div>
  );
}

function TrendBadge({ current, previous }: { current: number; previous: number }) {
  const delta = current - previous;
  const isFlat = Math.abs(delta) < 1;
  const Icon = isFlat ? Minus : delta > 0 ? TrendingUp : TrendingDown;
  const color = isFlat ? "var(--muted)" : delta > 0 ? "var(--success)" : "var(--danger)";
  const text = isFlat
    ? "Same as your last attempt at this company"
    : `${delta > 0 ? "+" : ""}${delta} vs your last attempt at this company (${previous}%)`;
  return (
    <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color }}>
      <Icon size={13} /> {text}
    </div>
  );
}
