import { notFound, redirect } from "next/navigation";
import { getCurrentHouseholdId } from "@/lib/currentHousehold";
import { getChild, getCompletedTopicIds, getJournalEntries } from "@/lib/children";
import { getTopic } from "@/data/topics";
import LessonView from "./LessonView";

export default async function LessonPage({
  params,
}: PageProps<"/children/[childId]/lesson/[topicId]">) {
  const householdId = await getCurrentHouseholdId();
  if (!householdId) redirect("/login");

  const { childId, topicId } = await params;
  const child = await getChild(householdId, Number(childId));
  if (!child) notFound();

  const topic = getTopic(topicId);
  const [completedTopicIds, journal] = await Promise.all([
    getCompletedTopicIds(child.id),
    getJournalEntries(child.id),
  ]);
  const entries = journal.filter((e) => e.topicId === topicId);

  return (
    <LessonView
      childId={child.id}
      childName={child.name}
      topic={topic ?? null}
      done={topic ? completedTopicIds.includes(topic.id) : false}
      entries={entries}
    />
  );
}
