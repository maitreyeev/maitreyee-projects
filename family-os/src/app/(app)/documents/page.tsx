import { sql } from "@/lib/db";
import { redirect } from "next/navigation";
import { FileText } from "lucide-react";
import Card from "@/components/Card";
import { getCurrentMember } from "@/lib/currentMember";
import DocumentForm from "./DocumentForm";
import DocumentList from "./DocumentList";

export default async function DocumentsPage() {
  const me = await getCurrentMember();
  if (!me) redirect("/login");
  const [documents, members] = await Promise.all([
    sql`
      SELECT d.id, d.title, d.category, d.file_path, d.file_name, d.expiry_date, fm.name AS member_name, fm.emoji
      FROM documents d
      LEFT JOIN family_members fm ON fm.id = d.family_member_id
      WHERE d.deleted_at IS NULL AND d.household_id = ${me.householdId}
      ORDER BY d.created_at DESC
    `,
    sql`SELECT id, name, emoji FROM family_members WHERE deleted_at IS NULL AND household_id = ${me.householdId} ORDER BY id ASC`,
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-peach text-peach-ink flex items-center justify-center shrink-0">
          <FileText size={20} />
        </div>
        <h1 className="text-xl font-extrabold tracking-tight">Documents</h1>
      </div>

      <DocumentForm members={members as { id: number; name: string; emoji: string }[]} />

      {documents.length === 0 ? (
        <Card className="p-6 text-center text-muted text-sm">No documents uploaded yet.</Card>
      ) : (
        <DocumentList
          documents={
            documents as {
              id: number;
              title: string;
              category: string;
              file_path: string | null;
              file_name: string | null;
              expiry_date: string | null;
              member_name: string | null;
              emoji: string | null;
            }[]
          }
        />
      )}
    </div>
  );
}
