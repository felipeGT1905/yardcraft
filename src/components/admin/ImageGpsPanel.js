"use client";

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Admin-only GPS readout for an uploaded comparison image.
 * @param {{ found?: boolean, label?: string, address?: string, latitude?: number, longitude?: number } | null | undefined} gps
 */
export function ImageGpsPanel({ gps, loading = false, visible = true }) {
  if (!visible) return null;

  const mapsHref =
    gps?.found && Number.isFinite(gps.latitude) && Number.isFinite(gps.longitude)
      ? `https://www.google.com/maps?q=${gps.latitude},${gps.longitude}`
      : null;

  return (
    <div
      className={cx(
        "mt-3 rounded-2xl border border-card-border bg-black/10 px-3.5 py-2.5",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
      )}
    >
      <div className="text-[10px] font-semibold tracking-[0.22em] uppercase text-muted">GPS</div>
      {loading ? (
        <p className="mt-1 text-[12px] text-muted/90">Reading coordinates and address…</p>
      ) : gps?.found && gps?.label ? (
        <div className="mt-1 space-y-1.5">
          <p className="font-mono text-[13px] font-medium tracking-tight text-foreground">
            {gps.label}
          </p>
          {gps.address ? (
            <p className="text-[12px] leading-relaxed text-foreground/75">{gps.address}</p>
          ) : (
            <p className="text-[12px] text-muted/85">Address not available</p>
          )}
          {mapsHref ? (
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-[11px] font-semibold tracking-[0.06em] text-gold/90 uppercase transition hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/55"
            >
              Open in Maps
            </a>
          ) : null}
        </div>
      ) : (
        <p className="mt-1 text-[12px] text-muted/90">GPS location not found</p>
      )}
    </div>
  );
}
