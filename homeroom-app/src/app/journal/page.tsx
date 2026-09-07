"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, BookHeart, Trash2 } from "lucide-react";
import Card from "@/components/Card";
import { getTopic } from "@/data/topics";
import {
  deleteJournalEntry,
  emptyState,
  getActiveChild,
  loadState,
  type AppState,
} from "@/lib/store";

export default function JournalPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState>(emptyState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const s = loadState();
    if (!getActiveChild(s)) {
      router.replace("/");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydrate from localStorage on mount
    setState(s);
    setHydrated(true);
  }, [router]);

  const child = getActiveChild(state);

  if (!hydrated || !child) {
    return <div className="min-h-screen" />;
  }

  function removeEntry(entryId: string) {
    if (!child) return;
    setState(deleteJournalEntry(state, child.id, entryId));
  }

  return (
    <div className="min-h-screen px-6 py-8 max-w-2xl mx-auto">
      <Link
        href="/syllabus"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Syllabus
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <div className="h-10 w-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
          <BookHeart size={18} />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          {child.name.split(" ")[0]}&apos;s journal
        </h1>
      </div>
      <p className="text-muted mb-8">
        Every note and photo you&apos;ve saved after an activity, newest first.
      </p>

      {child.journal.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-sm text-muted leading-relaxed">
            No entries yet. Open any lesson and save a quick note after you try
            the activity — it builds into a running record of what
            worked, over time.
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {child.journal.map((entry) => {
            const topic = getTopic(entry.topicId);
            return (
              <Card key={entry.id} className="p-4 flex gap-3">
                {entry.photo && (
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden shrink-0">
                    <Image src={entry.photo} alt="Journal entry" fill className="object-cover" unoptimized />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  {topic ? (
                    <Link href={`/lesson/${topic.id}`} className="text-sm font-bold text-accent hover:underline">
                      {topic.title}
                    </Link>
                  ) : (
                    <span className="text-sm font-bold text-muted">Topic removed</span>
                  )}
                  <p className="text-sm leading-relaxed mt-1">{entry.note}</p>
                  <p className="text-xs text-muted mt-1.5">
                    {new Date(entry.createdAt).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <button
                  aria-label="Delete entry"
                  onClick={() => removeEntry(entry.id)}
                  className="text-muted hover:text-danger transition-colors cursor-pointer shrink-0 h-7 w-7 flex items-center justify-center"
                >
                  <Trash2 size={14} />
                </button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
