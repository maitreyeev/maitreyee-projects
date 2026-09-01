"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Trash2, Sparkles } from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import CompanyBadge from "@/components/CompanyBadge";
import { getCompany } from "@/data";
import { clearHistory, loadHistory, type HistoryEntry } from "@/lib/history";

const BAND_COLOR: Record<string, string> = {
  "not-ready": "var(--danger)",
  developing: "var(--warning)",
  close: "var(--warning)",
  ready: "var(--success)",
};

export default function HistoryPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<HistoryEntry[] | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(loadHistory());
  }, []);

  if (!entries) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Sparkles size={22} className="text-accent animate-pulse" />
      </div>
    );
  }

  function handleClear() {
    clearHistory();
    setEntries([]);
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-10">
      <div className="w-full max-w-lg flex flex-col gap-6">
        <header className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-surface-muted transition-colors cursor-pointer shrink-0"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold tracking-tight">Past attempts</h1>
            <p className="text-xs text-muted mt-0.5">
              {entries.length === 0
                ? "Nothing here yet"
                : `${entries.length} completed session${entries.length === 1 ? "" : "s"}, stored on this device only`}
            </p>
          </div>
        </header>

        {entries.length === 0 ? (
          <Card className="p-8 flex flex-col items-center text-center gap-3">
            <div className="h-11 w-11 rounded-full bg-accent-soft text-accent flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Complete a full practice session and it&apos;ll show up here, so you can track whether
              you&apos;re actually improving over time.
            </p>
            <Button onClick={() => router.push("/")}>Start a session</Button>
          </Card>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {entries.map((entry, i) => (
                <HistoryRow key={entry.id} entry={entry} index={i} />
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={handleClear} className="self-center text-muted">
              <Trash2 size={14} /> Clear history
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function HistoryRow({ entry, index }: { entry: HistoryEntry; index: number }) {
  const company = getCompany(entry.companyId);
  const color = BAND_COLOR[entry.verdict.band] ?? "var(--warning)";
  const date = new Date(entry.date);
  const dateLabel = date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.3) }}
    >
      <Card className="p-4 flex items-center gap-3">
        <CompanyBadge name={company?.name ?? entry.companyName} color={company?.color ?? "#666"} size={40} />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">
            {entry.companyName} · {entry.displayRole}
          </div>
          <div className="text-xs text-muted mt-0.5">
            {dateLabel}
            {entry.attempt > 1 ? ` · attempt ${entry.attempt}` : ""}
          </div>
        </div>
        <div
          className="h-11 w-11 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
          style={{ background: `${color}1a`, color }}
        >
          {entry.verdict.probability}%
        </div>
      </Card>
    </motion.div>
  );
}
