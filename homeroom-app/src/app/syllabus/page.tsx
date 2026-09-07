"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronRight, Sparkles } from "lucide-react";
import Card from "@/components/Card";
import { getBoard } from "@/data/boards";
import { syllabusForAge, SUBJECT_STYLE } from "@/data/syllabus";
import { getLesson } from "@/data/lessons";
import { loadSession, type SessionState } from "@/lib/session";

export default function SyllabusPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionState | null>(null);

  useEffect(() => {
    const s = loadSession();
    if (!s.age || !s.boardId) {
      router.replace("/");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydrate from localStorage on mount
    setSession(s);
  }, [router]);

  if (!session || !session.age || !session.boardId) {
    return <div className="min-h-screen" />;
  }

  const board = getBoard(session.boardId);
  const groups = syllabusForAge(session.age);
  const totalTopics = groups.reduce((n, g) => n + g.topics.length, 0);
  const firstName = session.name.split(" ")[0] || "your child";

  return (
    <div className="min-h-screen px-6 py-8 max-w-2xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Start over
      </Link>

      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-accent">
        {board.name} · {board.gradeLabel(session.age)}
      </div>
      <h1 className="text-2xl font-extrabold tracking-tight mb-2">
        {firstName}&apos;s syllabus
      </h1>
      <p className="text-muted mb-8">
        {totalTopics} topics across {groups.length} subjects, curated for age{" "}
        {session.age} on the {board.name} pathway. Pick any topic to get a
        hands-on lesson.
      </p>

      <div className="flex flex-col gap-8">
        {groups.map((group) => {
          const style = SUBJECT_STYLE[group.key];
          return (
            <section key={group.key}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
                <h2 className="font-extrabold text-sm uppercase tracking-wide text-muted">
                  {group.label}
                </h2>
              </div>
              <div className="flex flex-col gap-2.5">
                {group.topics.map((topic) => {
                  const hasLesson = Boolean(getLesson(topic.id));
                  return (
                    <Link key={topic.id} href={`/lesson/${topic.id}`}>
                      <Card className="p-4 flex items-center gap-3 hover:border-accent/50 transition-all cursor-pointer">
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm">{topic.title}</div>
                          <div className="text-xs text-muted mt-0.5 leading-relaxed">
                            {topic.blurb}
                          </div>
                        </div>
                        {hasLesson && (
                          <span className={`shrink-0 flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${style.bg} ${style.text}`}>
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
    </div>
  );
}
