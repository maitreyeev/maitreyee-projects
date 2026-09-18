"use client";

import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import Button from "@/components/Button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-4 px-6">
      <div className="h-14 w-14 rounded-2xl bg-danger-soft text-danger flex items-center justify-center">
        <TriangleAlert size={24} />
      </div>
      <div>
        <h1 className="text-lg font-extrabold">Something went wrong</h1>
        <p className="text-sm text-muted mt-1 max-w-sm">That didn&apos;t go through. Try again, or head back to the dashboard.</p>
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" size="sm" onClick={() => reset()}>
          Try again
        </Button>
        <Link href="/">
          <Button size="sm">Back to dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
