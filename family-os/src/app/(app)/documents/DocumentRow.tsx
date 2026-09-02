"use client";

import { FileText, Download } from "lucide-react";
import Card from "@/components/Card";
import DeleteButton from "@/components/DeleteButton";
import { deleteDocument } from "./actions";

interface Document {
  id: number;
  title: string;
  category: string;
  file_path: string | null;
  file_name: string | null;
  expiry_date: string | null;
  member_name: string | null;
  emoji: string | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  medical: "Medical",
  school: "School",
  insurance: "Insurance",
  warranty: "Warranty",
  travel: "Travel",
  general: "General",
};

export default function DocumentRow({ document: d }: { document: Document }) {
  const expiringSoon =
    d.expiry_date && new Date(d.expiry_date) <= new Date(new Date().setMonth(new Date().getMonth() + 1));

  return (
    <Card className="p-4 flex items-center gap-3">
      <div className="h-11 w-11 rounded-2xl bg-peach text-peach-ink flex items-center justify-center shrink-0">
        <FileText size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm truncate">{d.title}</div>
        <div className="text-xs text-muted truncate">
          {CATEGORY_LABELS[d.category] ?? d.category}
          {d.member_name ? ` · ${d.emoji} ${d.member_name}` : ""}
          {d.expiry_date && (
            <span className={expiringSoon ? "text-danger font-bold" : ""}>
              {" "}
              · Expires {new Date(d.expiry_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          )}
        </div>
      </div>
      {d.file_path && (
        <a
          href={`/api/files/${d.file_path}`}
          target="_blank"
          rel="noopener noreferrer"
          className="h-9 w-9 rounded-full flex items-center justify-center text-accent hover:bg-accent-soft transition-colors shrink-0"
          aria-label={`Open ${d.file_name}`}
        >
          <Download size={16} />
        </a>
      )}
      <DeleteButton onConfirm={() => deleteDocument(d.id)} label="Delete document" />
    </Card>
  );
}
