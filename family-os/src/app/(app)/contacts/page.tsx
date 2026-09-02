import { sql } from "@/lib/db";
import { redirect } from "next/navigation";
import { Phone } from "lucide-react";
import Card from "@/components/Card";
import { getCurrentMember } from "@/lib/currentMember";
import ContactForm from "./ContactForm";
import ContactRow from "./ContactRow";

export default async function ContactsPage() {
  const me = await getCurrentMember();
  if (!me) redirect("/login");
  const contacts = await sql`
    SELECT id, name, relation, phone, notes FROM emergency_contacts
    WHERE deleted_at IS NULL AND household_id = ${me.householdId} ORDER BY id ASC
  `;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-blush text-blush-ink flex items-center justify-center shrink-0">
          <Phone size={20} />
        </div>
        <h1 className="text-xl font-extrabold tracking-tight">Emergency Contacts</h1>
      </div>

      <ContactForm />

      {contacts.length === 0 ? (
        <Card className="p-6 text-center text-muted text-sm">No emergency contacts yet.</Card>
      ) : (
        <div className="flex flex-col gap-3">
          {(contacts as { id: number; name: string; relation: string | null; phone: string; notes: string | null }[]).map((c) => (
            <ContactRow key={c.id} contact={c} />
          ))}
        </div>
      )}
    </div>
  );
}
