"use client";

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

export function DesignComparisonComingSoon({
  className = "",
  useMobileAspectFrame = false,
}) {
  const panel = (
    <div
      className={cx(
        "relative flex h-full min-h-[min(52dvh,420px)] w-full flex-col items-center justify-center overflow-hidden",
        "bg-[linear-gradient(165deg,rgba(255,255,255,0.04),rgba(0,0,0,0.55))]",
        useMobileAspectFrame ? "min-h-0" : "md:min-h-[70dvh] lg:min-h-[80vh]",
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(720px_320px_at_50%_0%,rgba(214,178,94,0.12),transparent_62%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(640px_280px_at_50%_100%,rgba(31,122,58,0.1),transparent_58%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 bg-[linear-gradient(110deg,transparent_42%,rgba(255,255,255,0.04)_50%,transparent_58%)]"
      />

      <div className="relative mx-auto max-w-md px-6 py-14 text-center sm:px-8 sm:py-16">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/12 bg-white/5 shadow-[0_20px_50px_-32px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.08)]">
          <LandscapeIcon className="h-7 w-7 text-gold/90" />
        </div>

        <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-gold/85">
          Coming soon
        </p>

        <h3 className="mt-3 font-serif text-[1.5rem] font-semibold leading-[1.12] tracking-[-0.02em] text-foreground sm:text-[1.75rem]">
          Your property preview is on the way
        </h3>

        <p className="mt-3 text-[14px] leading-[1.75] text-foreground/62 sm:text-[15px]">
          We&apos;re preparing a tailored before &amp; after concept for this space. Check back
          shortly, or reach out below to start the conversation.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium tracking-[0.08em] text-foreground/70">
            Before &amp; after
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium tracking-[0.08em] text-foreground/70">
            Tailored to you
          </span>
        </div>
      </div>
    </div>
  );

  if (useMobileAspectFrame) {
    return (
      <div className="touch-pan-y-safe relative w-full">
        <div className="relative w-full overflow-hidden rounded-b-2xl shadow-[inset_0_-1px_0_rgba(255,255,255,0.1)]">
          <div className="aspect-video w-full">{panel}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cx("touch-pan-y-safe relative w-full", className)}>
      {panel}
    </div>
  );
}

function LandscapeIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M3 18h18M6 14l3.5-4 3 3.5L17 9l3 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="8" r="1.25" fill="currentColor" />
    </svg>
  );
}
