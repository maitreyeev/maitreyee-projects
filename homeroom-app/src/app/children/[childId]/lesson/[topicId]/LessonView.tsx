"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import {
  ArrowLeft,
  Camera,
  Check,
  Clock,
  Lightbulb,
  ListChecks,
  MessageCircleQuestion,
  Printer,
  Rocket,
  Trash2,
} from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { getLesson } from "@/data/lessons";
import { subjectLabel, SUBJECT_STYLE } from "@/data/syllabus";
import type { Topic } from "@/data/types";
import type { JournalEntryRow } from "@/lib/children";
import { resizeImageFile } from "@/lib/image";
import { addJournalEntryAction, deleteJournalEntryAction, toggleTopicDoneAction } from "../../actions";

export default function LessonView({
  childId,
  childName,
  topic,
  done: initialDone,
  entries,
}: {
  childId: number;
  childName: string;
  topic: Topic | null;
  done: boolean;
  entries: JournalEntryRow[];
}) {
  const router = useRouter();
  const [done, setDone] = useState(initialDone);
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [saving, startSaving] = useTransition();
  const [, startToggle] = useTransition();
  const [journalError, setJournalError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!topic) {
    return (
      <div className="min-h-screen px-6 py-8 max-w-2xl mx-auto">
        <BackLink childId={childId} />
        <p className="text-muted mt-6">
          We couldn&apos;t find that topic. It may have moved — head back to the syllabus and pick another.
        </p>
      </div>
    );
  }

  const lesson = getLesson(topic.id);
  const style = SUBJECT_STYLE[topic.subject];
  const label = subjectLabel(topic.subject, topic.age);

  function toggleDone() {
    setDone((d) => !d);
    startToggle(async () => {
      await toggleTopicDoneAction(childId, topic!.id);
    });
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const resized = await resizeImageFile(file);
      setPhoto(resized);
    } catch {
      // Unsupported file or browser — just skip the photo, note still works.
    }
  }

  function saveJournalEntry() {
    if (!note.trim()) return;
    setJournalError("");
    startSaving(async () => {
      const result = await addJournalEntryAction(childId, { topicId: topic!.id, note: note.trim(), photo });
      if (result.error) {
        setJournalError(result.error);
        return;
      }
      setNote("");
      setPhoto(undefined);
      if (fileInputRef.current) fileInputRef.current.value = "";
      router.refresh();
    });
  }

  function removeEntry(entryId: number) {
    startSaving(async () => {
      await deleteJournalEntryAction(childId, entryId);
      router.refresh();
    });
  }

  return (
    <div className="min-h-screen px-6 py-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6 no-print">
        <BackLink childId={childId} />
        {lesson && (
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <Printer size={16} /> Print
          </button>
        )}
      </div>

      <span
        className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 ${style.bg} ${style.text}`}
      >
        {label} · Age {topic.age}
      </span>
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">{topic.title}</h1>
      <p className="text-muted mb-5">{topic.blurb}</p>

      <button
        onClick={toggleDone}
        className={`no-print inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full mb-8 transition-colors cursor-pointer ${
          done ? "bg-accent text-accent-ink" : "bg-surface-muted text-foreground hover:bg-border/60"
        }`}
      >
        <Check size={15} strokeWidth={3} /> {done ? `Done for ${childName.split(" ")[0]}` : "Mark as done"}
      </button>

      {!lesson ? (
        <Card className="p-6 flex flex-col gap-3">
          <div className="h-10 w-10 rounded-xl bg-surface-muted flex items-center justify-center text-muted">
            <Lightbulb size={18} />
          </div>
          <h2 className="font-bold">This one&apos;s not written yet</h2>
          <p className="text-sm text-muted leading-relaxed">
            Homeroom&apos;s activity library is hand-written and growing — {topic.title} hasn&apos;t been curated
            yet. Pick another topic from the syllabus that shows &quot;Activity ready&quot;, or check back soon.
          </p>
          <Link href={`/children/${childId}/syllabus`}>
            <span className="inline-flex mt-1 text-sm font-bold text-accent hover:underline cursor-pointer">
              ← Back to the syllabus
            </span>
          </Link>
        </Card>
      ) : (
        <div className="flex flex-col gap-8">
          <Section icon={<MessageCircleQuestion size={16} />} title="Start here">
            <p className="text-[15px] leading-relaxed">{lesson.hook}</p>
          </Section>

          <Section icon={<Lightbulb size={16} />} title="What to teach">
            <ul className="flex flex-col gap-3">
              {lesson.teach.map((point, i) => (
                <li key={i} className="text-[15px] leading-relaxed flex gap-2.5">
                  <span className="text-accent font-extrabold shrink-0">{i + 1}.</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={<ListChecks size={16} />} title={`Activit${lesson.activities.length > 1 ? "ies" : "y"}`}>
            <div className="flex flex-col gap-4">
              {lesson.activities.map((activity, i) => (
                <Card key={i} className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-extrabold">{activity.title}</h3>
                    <span className="shrink-0 flex items-center gap-1 text-xs font-bold text-muted bg-surface-muted px-2.5 py-1 rounded-full">
                      <Clock size={11} /> {activity.time}
                    </span>
                  </div>
                  <div className="mb-3">
                    <div className="text-xs font-bold uppercase tracking-wide text-muted mb-1.5">You&apos;ll need</div>
                    <div className="flex flex-wrap gap-1.5">
                      {activity.materials.map((m, j) => (
                        <span key={j} className="text-xs bg-surface-muted rounded-full px-2.5 py-1">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide text-muted mb-1.5">Steps</div>
                    <ol className="flex flex-col gap-2">
                      {activity.steps.map((s, j) => (
                        <li key={j} className="text-sm leading-relaxed flex gap-2.5">
                          <span className="text-muted font-bold shrink-0">{j + 1}.</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </Card>
              ))}
            </div>
          </Section>

          <Section icon={<MessageCircleQuestion size={16} />} title="Talk it through">
            <p className="text-[15px] leading-relaxed">{lesson.reflect}</p>
          </Section>

          <Section icon={<Rocket size={16} />} title="Go further">
            <p className="text-[15px] leading-relaxed">{lesson.extension}</p>
          </Section>

          <section className="no-print">
            <div className="flex items-center gap-2 mb-3 text-accent">
              <Camera size={16} />
              <h2 className="font-extrabold text-sm uppercase tracking-wide">Journal — how did it go?</h2>
            </div>
            <Card className="p-5 flex flex-col gap-3">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={`Jot down how ${childName.split(" ")[0]} did — what clicked, what to try differently next time…`}
                rows={3}
                className="w-full rounded-2xl bg-surface-muted border border-border p-4 text-sm outline-none focus:border-accent transition-colors resize-none"
              />
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="text-xs text-muted file:mr-3 file:rounded-full file:border-0 file:bg-surface-muted file:px-3 file:py-1.5 file:text-xs file:font-bold file:cursor-pointer cursor-pointer"
                />
                {photo && (
                  <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0">
                    <Image src={photo} alt="Attached preview" fill className="object-cover" unoptimized />
                  </div>
                )}
              </div>
              {journalError && <p className="text-sm text-danger">{journalError}</p>}
              <Button size="sm" className="self-start" disabled={!note.trim() || saving} onClick={saveJournalEntry}>
                {saving ? "Saving…" : "Save to journal"}
              </Button>
            </Card>

            {entries.length > 0 && (
              <div className="flex flex-col gap-3 mt-4">
                {entries.map((entry) => (
                  <Card key={entry.id} className="p-4 flex gap-3">
                    {entry.photo && (
                      <div className="relative h-14 w-14 rounded-xl overflow-hidden shrink-0">
                        <Image src={entry.photo} alt="Journal entry" fill className="object-cover" unoptimized />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-relaxed">{entry.note}</p>
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
                ))}
              </div>
            )}
          </section>

          <Link href={`/children/${childId}/syllabus`} className="no-print">
            <span className="inline-flex text-sm font-bold text-accent hover:underline cursor-pointer">
              ← Back to the syllabus
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}

function BackLink({ childId }: { childId: number }) {
  return (
    <Link
      href={`/children/${childId}/syllabus`}
      className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
    >
      <ArrowLeft size={16} /> Syllabus
    </Link>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3 text-accent">
        {icon}
        <h2 className="font-extrabold text-sm uppercase tracking-wide">{title}</h2>
      </div>
      {children}
    </section>
  );
}
