"use client";

import { useEffect, useMemo, useState } from "react";

function getEmbedUrlWithTracking(embedUrl, { slug, pageUrl, timestamp }) {
  if (!embedUrl) return "";

  let url;
  try {
    url = new URL(embedUrl);
  } catch {
    // If QuoteIQ ever gives a relative URL, fall back to returning it as-is.
    return embedUrl;
  }

  // YardCraft attribution (redundant keys to maximize compatibility).
  url.searchParams.set("yc_source_property", slug || "");
  url.searchParams.set("yc_source_slug", slug || "");
  url.searchParams.set("yc_source_url", pageUrl || "");
  url.searchParams.set("yc_source_ts", timestamp || "");

  // Useful generic attribution for dashboards that parse UTM fields.
  url.searchParams.set("utm_source", "yardcraft");
  url.searchParams.set("utm_medium", "qr");
  url.searchParams.set("utm_campaign", "property");
  if (slug) url.searchParams.set("utm_content", slug);

  return url.toString();
}

export function QuoteIqEmbed({ slug, pageUrl }) {
  // IMPORTANT: avoid hydration mismatch. This component is server-rendered and hydrated on the
  // client; generating a timestamp during render would differ between server/client.
  const [timestamp, setTimestamp] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setTimestamp(new Date().toISOString());
    });
  }, []);

  const embedSrc = useMemo(() => {
    const embedUrl = process.env.NEXT_PUBLIC_QUOTEIQ_EMBED_URL?.trim();
    return getEmbedUrlWithTracking(embedUrl, { slug, pageUrl, timestamp });
  }, [pageUrl, slug, timestamp]);

  useEffect(() => {
    let t = 0;
    queueMicrotask(() => {
      setLoaded(false);
      setTimedOut(false);
    });

    if (!embedSrc) return;
    t = window.setTimeout(() => setTimedOut(true), 12000);
    return () => clearTimeout(t);
  }, [embedSrc]);

  if (!embedSrc) {
    return (
      <div className="rounded-3xl border border-card-border bg-black/10 p-4 sm:p-5">
        <div className="rounded-2xl border border-card-border bg-background/40 px-4 py-4">
          <div className="font-serif text-lg font-semibold leading-[1.12] tracking-[-0.01em] text-foreground">
            Estimate form temporarily unavailable
          </div>
          <div className="mt-2 text-sm leading-6 text-muted">
            Please call/text and we’ll take care of your quote right away.
          </div>
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
          <div className="mt-2 text-sm leading-6 text-muted">
            Please call/text and we’ll take care of your quote right away.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="touch-pan-y-safe relative rounded-none border-0 bg-[#060607] p-0 shadow-[0_28px_80px_-40px_rgba(0,0,0,0.75),0_0_0_1px_rgba(0,0,0,0.45)_inset] sm:rounded-[28px] sm:border sm:border-white/[0.08] sm:p-px">
      <div className="pointer-events-none absolute inset-0 rounded-none bg-[linear-gradient(165deg,rgba(214,178,94,0.06),transparent_42%,rgba(31,122,58,0.04)_88%)] sm:rounded-[28px]" />
      <div className="touch-pan-y-safe relative rounded-none bg-[#08090a] py-6 px-1 sm:rounded-[27px] sm:p-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-none sm:rounded-[27px]">
          <div className="absolute -right-16 -top-16 h-[200px] w-[200px] rounded-full bg-green/6 blur-3xl" />
          <div className="absolute -bottom-20 -left-16 h-[220px] w-[220px] rounded-full bg-gold/5 blur-3xl" />
        </div>
        <div className="touch-pan-y-safe relative overflow-x-hidden overflow-y-visible rounded-none bg-[#030304] py-1.5 px-0 ring-0 sm:rounded-[20px] sm:p-1.5 sm:ring-1 sm:ring-white/[0.12]">
          {!loaded ? (
            <div className="touch-pan-y-safe absolute inset-0 z-10 grid place-items-center rounded-none bg-[#040405]/94 sm:rounded-[14px]">
              <div className="w-full max-w-xl px-6 py-10">
                <div className="mx-auto h-3 w-36 rounded-full bg-white/8" />
                <div className="mt-5 h-11 w-full rounded-xl bg-white/5" />
                <div className="mt-3 h-11 w-full rounded-xl bg-white/5" />
                <div className="mt-3 h-11 w-2/3 rounded-xl bg-white/5" />
                <div className="mt-6 h-12 w-full rounded-full bg-white/8" />
                <div className="mt-4 text-center text-[10px] font-medium tracking-widest uppercase text-muted">
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
              "touch-pan-y-safe relative z-0 h-[720px] w-full rounded-none border-0 bg-[#0a0a0b] sm:rounded-[13px]",
              "[color-scheme:dark]",
              loaded ? "opacity-100" : "opacity-0",
              "transition-opacity duration-500 ease-out",
            ].join(" ")}
            style={{
              filter: "brightness(0.92) contrast(1.02)",
            }}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="clipboard-write; payment; geolocation"
            sandbox={[
              "allow-forms",
              "allow-scripts",
              "allow-same-origin",
              "allow-popups",
              "allow-popups-to-escape-sandbox",
              "allow-top-navigation-by-user-activation",
            ].join(" ")}
          />
          <noscript>
            <div className="mt-3 rounded-2xl border border-card-border bg-background/40 p-4 text-sm text-muted">
              JavaScript is required to load the estimate form.
            </div>
          </noscript>
        </div>
      </div>
    </div>
  );
}
