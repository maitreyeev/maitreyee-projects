import Link from "next/link";
import { Compass } from "lucide-react";
import Card from "@/components/Card";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10">
      <Card className="p-8 flex flex-col items-center text-center gap-4 max-w-sm">
        <div className="h-11 w-11 rounded-full bg-accent-soft text-accent flex items-center justify-center">
          <Compass size={20} />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Page not found</h1>
          <p className="text-sm text-muted mt-2 leading-relaxed">
            That link doesn&apos;t lead anywhere in CrackIt. Your practice progress is safe either
            way — it&apos;s just saved on this device.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 h-14 px-8 text-base rounded-full bg-accent text-accent-ink hover:opacity-90 active:opacity-80 shadow-[0_8px_20px_-8px_var(--accent)] w-full"
        >
          Back to CrackIt
        </Link>
      </Card>
    </div>
  );
}
