"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { BookHeart, Check, ChevronRight, LayoutDashboard, Search, Shuffle, Sparkles } from "lucide-react";
import Card from "@/components/Card";
import Toggle from "@/components/Toggle";
import { getLesson } from "@/data/lessons";
import { SUBJECT_STYLE } from "@/data/syllabus";
import type { SubjectGroup } from "@/data/types";
import { toggleTopicDoneAction } from "../actions";

export default function SyllabusView({
  childId,
  childName,
  age,
  boardName,
  gradeLabel,
  groups,
  completedTopicIds,
}: {
  childId: number;
  childName: string;
  age: number;
  boardName: string;
  gradeLabel: string;
  groups: SubjectGroup[];
  completedTopicIds: string[];
}) {
  const router = useRouter();
  const [done, setDone] = useState<Set<string>>(new Set(completedTopicIds));
  const [query, setQuery] = useState("");
  const [readyOnly, setReadyOnly] = useState(false);
  const [, startTransition] = useTransition();

  const firstName = childName.split(" ")[0] || "Your child";
  const q = query.trim().toLowerCase();

  const filteredGroups = groups
    .map((group) => ({
      ...group,
      topics: group.topics.filter((t) => {
        if (readyOnly && !getLesson(t.id)) return false;
        if (!q) return true;
        return t.title.toLowerCase().includes(q) || t.blurb.toLowerCase().includes(q);
      }),
    }))
    .filter((g) => g.topics.length > 0);

  const totalTopics = groups.reduce((n, g) => n + g.topics.length, 0);
  const doneCount = groups.reduce((n, g) => n + g.topics.filter((t) => done.has(t.id)).length, 0);

  // Surprise Me respects the current search/filter — it should never
  // surprise you with something outside what you're currently looking at.
  const surpriseCandidates = filteredGroups.flatMap((g) => g.topics).filter((t) => getLesson(t.id));

  function surpriseMe() {
    if (surpriseCandidates.length === 0) return;
    const pick = surpriseCandidates[Math.floor(Math.random() * surpriseCandidates.length)];
    router.push(`/children/${childId}/lesson/${pick.id}`);
  }

  function markDone(topicId: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) next.delete(topicId);
      else next.add(topicId);
      return next;
    });
    startTransition(async () => {
      await toggleTopicDoneAction(childId, topicId);
    });
  }

  return (
    <div className="min-h-screen px-6 py-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6 no-print">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
        >
          <LayoutDashboard size={16} /> Dashboard
        </Link>
        <Link
          href={`/children/${childId}/journal`}
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
        >
          <BookHeart size={16} /> Journal
        </Link>
      </div>

      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-accent">
        {boardName} · {gradeLabel}
      </div>
      <h1 className="text-2xl font-extrabold tracking-tight mb-2">{firstName}&apos;s syllabus</h1>
      <p className="text-muted mb-2">
        {totalTopics} topics across {groups.length} subjects, curated for age {age} on the {boardName} pathway.
      </p>
      <div className="flex items-center gap-2 mb-6">
        <div className="flex-1 h-2 rounded-full bg-surface-muted overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-300"
            style={{ width: totalTopics ? `${(doneCount / totalTopics) * 100}%` : "0%" }}
          />
        </div>
        <span className="text-xs font-bold text-muted shrink-0">
          {doneCount}/{totalTopics} done
        </span>
      </div>

      <div className="flex flex-col gap-3 mb-8 no-print">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics…"
            className="w-full h-11 rounded-full bg-surface-muted border border-border pl-11 pr-4 text-sm outline-none focus:border-accent transition-colors"
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Toggle checked={readyOnly} onChange={setReadyOnly} label="Show only topics with an activity ready" />
            <span className="text-sm font-medium">Activity ready only</span>
          </div>
          <button
            onClick={surpriseMe}
            disabled={surpriseCandidates.length === 0}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-accent hover:underline disabled:opacity-40 disabled:no-underline cursor-pointer disabled:cursor-not-allowed shrink-0"
          >
            <Shuffle size={15} /> Surprise me
          </button>
        </div>
      </div>

      {filteredGroups.length === 0 ? (
        <p className="text-muted text-sm">No topics match that search. Try clearing the filter.</p>
      ) : (
        <div className="flex flex-col gap-8">
          {filteredGroups.map((group) => {
            const style = SUBJECT_STYLE[group.key];
            const groupDone = group.topics.filter((t) => done.has(t.id)).length;
            return (
              <section key={group.key}>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
                    <h2 className="font-extrabold text-sm uppercase tracking-wide text-muted">{group.label}</h2>
                  </div>
                  <span className="text-xs font-bold text-muted">
                    {groupDone}/{group.topics.length}
                  </span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {group.topics.map((topic) => {
                    const hasLesson = Boolean(getLesson(topic.id));
                    const isDone = done.has(topic.id);
                    return (
                      <Link key={topic.id} href={`/children/${childId}/lesson/${topic.id}`}>
                        <Card
                          className={`p-4 flex items-center gap-3 hover:border-accent/50 transition-all cursor-pointer ${
                            isDone ? "opacity-70" : ""
                          }`}
                        >
                          <button
                            aria-label={isDone ? "Mark as not done" : "Mark as done"}
                            onClick={(e) => markDone(topic.id, e)}
                            className={`h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                              isDone
                                ? "bg-accent border-accent text-accent-ink"
                                : "border-border text-transparent hover:border-accent"
                            }`}
                          >
                            <Check size={13} strokeWidth={3} />
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className={`font-bold text-sm ${isDone ? "line-through decoration-2" : ""}`}>
                              {topic.title}
                            </div>
                            <div className="text-xs text-muted mt-0.5 leading-relaxed">{topic.blurb}</div>
                          </div>
                          {hasLesson && (
                            <span
                              className={`shrink-0 flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${style.bg} ${style.text}`}
                            >
                              <Sparkles size={11} /> Activity ready
                            </span>
                          )}
                          <ChevronRight size={16} className="text-muted shrink-0" />
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
