import { notFound, redirect } from "next/navigation";
import { getCurrentHouseholdId } from "@/lib/currentHousehold";
import { getChild, getJournalEntries } from "@/lib/children";
import JournalView from "./JournalView";

export default async function JournalPage({ params }: PageProps<"/children/[childId]/journal">) {
  const householdId = await getCurrentHouseholdId();
  if (!householdId) redirect("/login");

  const { childId } = await params;
  const child = await getChild(householdId, Number(childId));
  if (!child) notFound();

  const entries = await getJournalEntries(child.id);

  return <JournalView childId={child.id} childName={child.name} entries={entries} />;
}
