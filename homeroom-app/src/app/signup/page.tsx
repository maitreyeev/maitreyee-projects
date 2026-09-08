import { redirect } from "next/navigation";
import { getCurrentHouseholdId } from "@/lib/currentHousehold";
import SignupWizard from "./SignupWizard";

export default async function SignupPage() {
  const householdId = await getCurrentHouseholdId();
  if (householdId) redirect("/dashboard");
  return <SignupWizard />;
}
