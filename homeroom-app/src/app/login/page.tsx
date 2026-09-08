import { redirect } from "next/navigation";
import { getCurrentHouseholdId } from "@/lib/currentHousehold";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const householdId = await getCurrentHouseholdId();
  if (householdId) redirect("/dashboard");
  return <LoginForm />;
}
