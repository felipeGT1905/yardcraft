"use client";

import { Container } from "@/components/ui/Container";
import { BRAND } from "@/lib/brand";
import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/motion/gsap";

export function StickyMobileCta() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReduced) return;

    const { gsap } = getGsap();

    let lastY = window.scrollY || 0;
    let hidden = false;

    const show = () => {
      if (!hidden) return;
      hidden = false;
      gsap.to(el, { y: 0, duration: 0.45, ease: "power3.out" });
    };

    const hide = () => {
      if (hidden) return;
      hidden = true;
      gsap.to(el, { y: "110%", duration: 0.45, ease: "power3.out" });
    };

    // Entrance
    gsap.fromTo(el, { y: "110%", opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "expo.out" });

    const onScroll = () => {
      const y = window.scrollY || 0;
      const delta = y - lastY;
      lastY = y;

      if (y < 24) return show();
      if (delta > 6) hide();
      else if (delta < -6) show();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-card-border/70 bg-background/80 backdrop-blur sm:hidden"
    >
      <Container className="flex items-center gap-3 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold tracking-tight text-foreground">
            Your YardCraft preview is ready
          </div>
          <div className="truncate text-xs text-muted">Call now or request your custom plan</div>
        </div>
        <div className="ml-auto flex shrink-0 gap-2">
          <a
            href="#quote"
            className="inline-flex max-w-[158px] items-center justify-center rounded-full bg-green px-4 py-3.5 text-[11px] font-semibold leading-tight tracking-[0.03em] text-white transition hover:bg-[color-mix(in_oklab,var(--green)_88%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:max-w-none sm:px-5 sm:text-[12px] sm:leading-none"
          >
            Request Your Custom Plan
          </a>
          <a
            href={`tel:${BRAND.phoneTel}`}
            className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-5 py-3.5 text-[13px] font-semibold tracking-[0.04em] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition hover:border-white/55 hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Call Now
          </a>
        </div>
      </Container>
    </div>
  );
}

