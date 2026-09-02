import { sql } from "@/lib/db";
import { redirect } from "next/navigation";
import SetupWizard from "./SetupWizard";

export default async function SetupPage() {
  const existing = await sql`SELECT id FROM household_auth WHERE id = 1`;
  if (existing.length > 0) {
    redirect("/login");
  }
  return <SetupWizard />;
}
