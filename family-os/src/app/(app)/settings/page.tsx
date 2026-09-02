import Link from "next/link";
import { sql } from "@/lib/db";
import { Settings, Users, Trash2, ChevronRight } from "lucide-react";
import MembersManager from "./MembersManager";
import SecurityForms from "./SecurityForms";
import TextSizeToggle from "./TextSizeToggle";

export default async function SettingsPage() {
  const members = await sql`
    SELECT id, name, role, emoji, color FROM family_members WHERE deleted_at IS NULL ORDER BY id ASC
  `;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-ink text-ink-foreground flex items-center justify-center shrink-0">
          <Settings size={20} />
        </div>
        <h1 className="text-xl font-extrabold tracking-tight">Settings</h1>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-extrabold flex items-center gap-2 text-sm uppercase tracking-wide text-muted">
          <Users size={14} /> Family members
        </h2>
        <MembersManager
          members={
            members as {
              id: number;
              name: string;
              role: "parent" | "child" | "grandparent" | "other";
              emoji: string;
              color: string;
            }[]
          }
        />
      </section>

      <TextSizeToggle />

      <section className="flex flex-col gap-3">
        <h2 className="font-extrabold text-sm uppercase tracking-wide text-muted">Security</h2>
        <SecurityForms />
      </section>

      <Link
        href="/trash"
        className="flex items-center gap-3 p-4 rounded-3xl bg-surface card-shadow hover:scale-[1.01] transition-transform"
      >
        <div className="h-9 w-9 rounded-xl bg-surface-muted flex items-center justify-center shrink-0 text-muted">
          <Trash2 size={16} />
        </div>
        <span className="flex-1 font-bold text-sm">Trash</span>
        <ChevronRight size={16} className="text-muted" />
      </Link>
    </div>
  );
}
