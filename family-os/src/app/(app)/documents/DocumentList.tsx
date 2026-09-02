"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/Input";
import DocumentRow from "./DocumentRow";

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

const TABS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "medical", label: "Medical" },
  { value: "school", label: "School" },
  { value: "insurance", label: "Insurance" },
  { value: "warranty", label: "Warranty" },
  { value: "travel", label: "Travel" },
  { value: "general", label: "General" },
];

export default function DocumentList({ documents }: { documents: Document[] }) {
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const byCategory = tab === "all" ? documents : documents.filter((d) => d.category === tab);
  const filtered = query.trim()
    ? byCategory.filter((d) => d.title.toLowerCase().includes(query.trim().toLowerCase()))
    : byCategory;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search documents…"
          className="pl-11"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold cursor-pointer transition-colors ${
              tab === t.value ? "bg-ink text-ink-foreground" : "bg-surface-muted text-muted hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted text-sm py-6">
          {query.trim() ? `No documents matching "${query.trim()}".` : "Nothing in this category yet."}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((d) => (
            <DocumentRow key={d.id} document={d} />
          ))}
        </div>
      )}
    </div>
  );
}
