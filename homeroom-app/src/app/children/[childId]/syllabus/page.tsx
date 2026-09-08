import { notFound, redirect } from "next/navigation";
import { getCurrentHouseholdId } from "@/lib/currentHousehold";
import { getChild, getCompletedTopicIds } from "@/lib/children";
import { getBoard } from "@/data/boards";
import { syllabusForAge } from "@/data/syllabus";
import SyllabusView from "./SyllabusView";

export default async function SyllabusPage({ params }: PageProps<"/children/[childId]/syllabus">) {
  const householdId = await getCurrentHouseholdId();
  if (!householdId) redirect("/login");

  const { childId } = await params;
  const child = await getChild(householdId, Number(childId));
  if (!child) notFound();

  const completedTopicIds = await getCompletedTopicIds(child.id);
  const groups = syllabusForAge(child.age);
  const board = getBoard(child.boardId);

  return (
    <SyllabusView
      childId={child.id}
      childName={child.name}
      age={child.age}
      boardName={board.name}
      gradeLabel={board.gradeLabel(child.age)}
      groups={groups}
      completedTopicIds={completedTopicIds}
    />
  );
}
