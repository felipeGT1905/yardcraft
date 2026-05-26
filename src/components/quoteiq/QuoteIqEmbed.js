"use client";

import { useEffect, useState } from "react";

import { getQuoteIqConfiguredBaseUrl, getQuoteIqEmbedUrl } from "@/lib/quoteiq";

const LOAD_TIMEOUT_MS = 15000;

export function QuoteIqEmbed({ slug, pageUrl }) {
  // Resolve iframe src once on the client to avoid SSR/hydration timestamp drift
  // and prevent a second iframe reload after mount (which could reset in-progress forms).
  const [embedSrc, setEmbedSrc] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const baseUrl = getQuoteIqConfiguredBaseUrl();
    if (!baseUrl) return;

    setEmbedSrc(
      getQuoteIqEmbedUrl(baseUrl, {
        slug,
        pageUrl,
        timestamp: new Date().toISOString(),
      }),
    );
  }, [slug, pageUrl]);

  useEffect(() => {
    if (!embedSrc) return undefined;

    setLoaded(false);
    setTimedOut(false);

    const timer = window.setTimeout(() => setTimedOut(true), LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [embedSrc]);

  if (!getQuoteIqConfiguredBaseUrl()) {
    return (
      <div className="rounded-3xl border border-card-border bg-black/10 p-4 sm:p-5">
        <div className="rounded-2xl border border-card-border bg-background/40 px-4 py-4">
          <div className="font-serif text-lg font-semibold leading-[1.12] tracking-[-0.01em] text-foreground">
            Estimate form temporarily unavailable
          </div>
          <p className="mt-2 text-sm leading-6 text-muted">
            Set <code className="text-foreground">NEXT_PUBLIC_QUOTEIQ_EMBED_URL</code> in your
            environment, then redeploy.
          </p>
        </div>
      </div>
    );
  }

  if (!embedSrc) {
    return (
      <div
        className="relative min-h-[720px] w-full rounded-none bg-[#0a0a0b] sm:rounded-[13px]"
        aria-busy="true"
        aria-label="Loading estimate form"
      >
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="text-[10px] font-medium tracking-widest uppercase text-muted">Loading</div>
        </div>
      </div>
    );
  }

  if (timedOut && !loaded) {
    return (
      <div className="rounded-3xl border border-card-border bg-black/10 p-4 sm:p-5">
        <div className="rounded-2xl border border-card-border bg-background/40 px-4 py-4">
          <div className="font-serif text-lg font-semibold leading-[1.12] tracking-[-0.01em] text-foreground">
            Estimate form is taking longer to load
          </div>
          <p className="mt-2 text-sm leading-6 text-muted">
            Please call/text and we&apos;ll take care of your quote right away.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-none border-0 bg-[#060607] p-0 shadow-[0_28px_80px_-40px_rgba(0,0,0,0.75),0_0_0_1px_rgba(0,0,0,0.45)_inset] sm:rounded-[28px] sm:border sm:border-white/[0.08] sm:p-px">
      <div className="pointer-events-none absolute inset-0 rounded-none bg-[linear-gradient(165deg,rgba(214,178,94,0.06),transparent_42%,rgba(31,122,58,0.04)_88%)] sm:rounded-[28px]" />
      <div className="relative rounded-none bg-[#08090a] px-1 py-6 sm:rounded-[27px] sm:p-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-none sm:rounded-[27px]">
          <div className="absolute -right-16 -top-16 h-[200px] w-[200px] rounded-full bg-green/6 blur-3xl" />
          <div className="absolute -bottom-20 -left-16 h-[220px] w-[220px] rounded-full bg-gold/5 blur-3xl" />
        </div>
        <div className="relative overflow-x-hidden overflow-y-visible rounded-none bg-[#030304] px-0 py-1.5 ring-0 sm:rounded-[20px] sm:p-1.5 sm:ring-1 sm:ring-white/[0.12]">
          {!loaded ? (
            <div
              className="pointer-events-none absolute inset-0 z-10 grid place-items-center rounded-none bg-[#040405]/94 sm:rounded-[14px]"
              aria-hidden="true"
            >
              <div className="w-full max-w-xl px-6 py-10">
                <div className="mx-auto h-3 w-36 rounded-full bg-white/8" />
                <div className="mt-5 h-11 w-full rounded-xl bg-white/5" />
                <div className="mt-3 h-11 w-full rounded-xl bg-white/5" />
                <div className="mt-3 h-11 w-2/3 rounded-xl bg-white/5" />
                <div className="mt-6 h-12 w-full rounded-full bg-white/8" />
                <div className="mt-4 text-center text-[10px] font-medium uppercase tracking-widest text-muted">
                  Loading
                </div>
              </div>
            </div>
          ) : null}
          <iframe
            title="QuoteIQ estimate form"
            src={embedSrc}
            onLoad={() => setLoaded(true)}
            className={[
              "relative z-0 h-[720px] w-full rounded-none border-0 bg-[#0a0a0b] sm:rounded-[13px]",
              "[color-scheme:dark]",
              loaded ? "opacity-100" : "opacity-0",
              "transition-opacity duration-500 ease-out",
            ].join(" ")}
            style={{ filter: "brightness(0.92) contrast(1.02)" }}
          />
        </div>
      </div>
    </div>
  );
}
