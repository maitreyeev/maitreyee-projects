import { redirect } from "next/navigation";
import { getCurrentHouseholdId } from "@/lib/currentHousehold";
import NewChildWizard from "./NewChildWizard";

export default async function NewChildPage() {
  const householdId = await getCurrentHouseholdId();
  if (!householdId) redirect("/login");
  return <NewChildWizard />;
}
