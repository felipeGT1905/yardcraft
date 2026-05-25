"use client";

import { useEffect, useState } from "react";

export function ToastHost({ toasts, onRemove }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-60 mx-auto w-full max-w-6xl px-4 sm:top-5 sm:px-6 lg:px-8">
      <div className="ml-auto flex max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onRemove={onRemove} />
        ))}
      </div>
    </div>
  );
}

function Toast({ toast, onRemove }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => onRemove(toast.id), 160);
    }, toast.durationMs ?? 2600);
    return () => clearTimeout(timer);
  }, [toast.durationMs, toast.id, onRemove]);

  const accent =
    toast.type === "success"
      ? "border-[color-mix(in_oklab,var(--green)_50%,var(--card-border))]"
      : toast.type === "error"
        ? "border-red-500/30"
        : "border-card-border";

  return (
    <div
      className={[
        "pointer-events-auto rounded-2xl border bg-background/85 px-4 py-3 text-sm backdrop-blur transition",
        accent,
        leaving ? "opacity-0 translate-y-[-4px]" : "opacity-100 translate-y-0",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-semibold tracking-tight text-foreground">{toast.title}</div>
          {toast.message ? (
            <div className="mt-1 text-xs text-muted">{toast.message}</div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => onRemove(toast.id)}
          className="text-muted hover:text-foreground transition"
          aria-label="Dismiss notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}

