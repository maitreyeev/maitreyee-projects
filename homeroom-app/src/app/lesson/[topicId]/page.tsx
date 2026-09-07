"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock, Lightbulb, ListChecks, MessageCircleQuestion, Rocket } from "lucide-react";
import Card from "@/components/Card";
import { getTopic } from "@/data/topics";
import { getLesson } from "@/data/lessons";
import { subjectLabel, SUBJECT_STYLE } from "@/data/syllabus";

export default function LessonPage() {
  const params = useParams<{ topicId: string }>();
  const topicId = params.topicId;
  const topic = getTopic(topicId);

  if (!topic) {
    return (
      <div className="min-h-screen px-6 py-8 max-w-2xl mx-auto">
        <BackLink />
        <p className="text-muted mt-6">
          We couldn&apos;t find that topic. It may have moved — head back to
          the syllabus and pick another.
        </p>
      </div>
    );
  }

  const lesson = getLesson(topicId);
  const style = SUBJECT_STYLE[topic.subject];
  const label = subjectLabel(topic.subject, topic.age);

  return (
    <div className="min-h-screen px-6 py-8 max-w-2xl mx-auto">
      <BackLink />

      <span className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 ${style.bg} ${style.text}`}>
        {label} · Age {topic.age}
      </span>
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">{topic.title}</h1>
      <p className="text-muted mb-8">{topic.blurb}</p>

      {!lesson ? (
        <Card className="p-6 flex flex-col gap-3">
          <div className="h-10 w-10 rounded-xl bg-surface-muted flex items-center justify-center text-muted">
            <Lightbulb size={18} />
          </div>
          <h2 className="font-bold">This one&apos;s not written yet</h2>
          <p className="text-sm text-muted leading-relaxed">
            Homeroom&apos;s activity library is hand-written and growing —{" "}
            {topic.title} hasn&apos;t been curated yet. Pick another topic
            from the syllabus that shows &quot;Activity ready&quot;, or check
            back soon.
          </p>
          <Link href="/syllabus">
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
                    <div className="text-xs font-bold uppercase tracking-wide text-muted mb-1.5">
                      You&apos;ll need
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {activity.materials.map((m, j) => (
                        <span key={j} className="text-xs bg-surface-muted rounded-full px-2.5 py-1">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide text-muted mb-1.5">
                      Steps
                    </div>
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

          <Link href="/syllabus">
            <span className="inline-flex text-sm font-bold text-accent hover:underline cursor-pointer">
              ← Back to the syllabus
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/syllabus"
      className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-6"
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
