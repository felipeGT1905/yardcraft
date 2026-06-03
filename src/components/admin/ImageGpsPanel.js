"use client";

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Admin-only GPS readout for an uploaded comparison image.
 * @param {{ found?: boolean, label?: string } | null | undefined} gps
 */
export function ImageGpsPanel({ gps, loading = false, visible = true }) {
  if (!visible) return null;

  return (
    <div
      className={cx(
        "mt-3 rounded-2xl border border-card-border bg-black/10 px-3.5 py-2.5",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
      )}
    >
      <div className="text-[10px] font-semibold tracking-[0.22em] uppercase text-muted">GPS</div>
      {loading ? (
        <p className="mt-1 text-[12px] text-muted/90">Reading location from image…</p>
      ) : gps?.found && gps?.label ? (
        <p className="mt-1 font-mono text-[13px] font-medium tracking-tight text-foreground">
          {gps.label}
        </p>
      ) : (
        <p className="mt-1 text-[12px] text-muted/90">GPS location not found</p>
      )}
    </div>
  );
}
