import { sql } from "@/lib/db";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const existing = await sql`SELECT id FROM household_auth LIMIT 1`;
  if (existing.length === 0) {
    redirect("/setup");
  }
  return <LoginForm />;
}
