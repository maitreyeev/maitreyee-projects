"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, ArrowLeft } from "lucide-react";
import { logout } from "@/lib/actions";
import type { FamilyMember } from "@/lib/currentMember";

export default function HeaderClient({
  householdName,
  member,
}: {
  householdName: string;
  member: FamilyMember;
}) {
  const pathname = usePathname();
  const isDashboard = pathname === "/";

  return (
    <header className="w-full border-b border-border bg-surface/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-2xl mx-auto px-5 py-3 flex items-center gap-3">
        {isDashboard ? (
          <div className="h-9 w-9 rounded-2xl bg-ink flex items-center justify-center shrink-0">
            <span className="text-ink-foreground text-sm font-extrabold">
              {householdName.charAt(0).toUpperCase()}
            </span>
          </div>
        ) : (
          <Link
            href="/"
            className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-surface-muted transition-colors shrink-0"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={18} />
          </Link>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-extrabold truncate">{householdName}</div>
        </div>
        <div
          className="h-9 w-9 rounded-full flex items-center justify-center text-lg shrink-0"
          style={{ background: `${member.color}22` }}
          title={member.name}
        >
          {member.emoji}
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-surface-muted transition-colors cursor-pointer shrink-0"
            aria-label="Switch profile / log out"
          >
            <LogOut size={17} />
          </button>
        </form>
      </div>
    </header>
  );
}
