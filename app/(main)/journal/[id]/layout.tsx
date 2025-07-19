import Link from "next/link";
import { Suspense } from "react";
import EntryLoading from "./loading";

export default function EntryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-6">
      <div className="mb-4">
        <Link
          href="/dashboard"
          className="text-sm text-orange-600 hover:text-orange-700"
        >
          ← Back to Dashboard
        </Link>
      </div>
      <Suspense fallback={<EntryLoading />}>{children}</Suspense>
    </div>
  );
}