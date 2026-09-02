import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/currentMember";
import { sql } from "@/lib/db";
import HeaderClient from "./HeaderClient";
import TextSizeSync from "./TextSizeSync";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const member = await getCurrentMember();
  if (!member) redirect("/login");

  const rows = await sql`SELECT household_name FROM household_auth WHERE id = ${member.householdId}`;
  const householdName = (rows[0]?.household_name as string) ?? "Family OS";

  return (
    <div className="min-h-screen flex flex-col">
      <TextSizeSync />
      <HeaderClient householdName={householdName} member={member} />
      <main className="flex-1 w-full max-w-2xl mx-auto px-5 py-6">{children}</main>
    </div>
  );
}
