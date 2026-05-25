"use client";

import { Button } from "@/components/ui/Button";

export function AdminQuickEditFab({ slug }) {
  return (
    <div className="fixed bottom-5 right-4 z-50 block sm:bottom-7">
      <div className="rounded-3xl border border-card-border bg-background/85 p-3 backdrop-blur">
        <div className="text-[11px] font-medium tracking-wide text-muted">
          Admin controls
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Button
            href={`/admin/designs?slug=${encodeURIComponent(slug)}`}
            className="px-4 py-2 text-[12px] sm:text-[13px]"
          >
            Edit Property
          </Button>
        </div>
      </div>
    </div>
  );
}

