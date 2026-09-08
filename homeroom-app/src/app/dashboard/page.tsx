import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Sprout } from "lucide-react";
import { getCurrentHouseholdId } from "@/lib/currentHousehold";
import { getChildrenForHousehold, getCompletedTopicIds, getJournalCount } from "@/lib/children";
import { computeProgress } from "@/data/syllabus";
import { logout } from "@/lib/actions";
import ChildCard from "./ChildCard";

export default async function DashboardPage() {
  const householdId = await getCurrentHouseholdId();
  if (!householdId) redirect("/login");

  const children = await getChildrenForHousehold(householdId);
  const cards = await Promise.all(
    children.map(async (child) => {
      const [completedTopicIds, journalCount] = await Promise.all([
        getCompletedTopicIds(child.id),
        getJournalCount(child.id),
      ]);
      const progress = computeProgress(child.age, completedTopicIds);
      return { child, progress, journalCount };
    })
  );

  return (
    <div className="min-h-screen px-6 py-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-accent flex items-center justify-center shrink-0">
            <Sprout size={18} className="text-accent-ink" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">Homeroom</h1>
        </div>
        <form action={logout}>
          <button type="submit" className="text-sm text-muted hover:text-foreground transition-colors cursor-pointer">
            Log out
          </button>
        </form>
      </div>

      {cards.length === 0 ? (
        <p className="text-muted">No children yet — something went wrong during signup. Try adding one below.</p>
      ) : (
        <div className="flex flex-col gap-5">
          {cards.map(({ child, progress, journalCount }) => (
            <ChildCard key={child.id} child={child} progress={progress} journalCount={journalCount} />
          ))}
        </div>
      )}

      <Link
        href="/children/new"
        className="mt-5 w-full h-14 rounded-2xl bg-surface-muted flex items-center justify-center gap-2 font-bold text-sm hover:bg-border/60 transition-colors"
      >
        <Plus size={18} /> Add another child
      </Link>
    </div>
  );
}
