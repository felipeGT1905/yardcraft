"use client";

import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/motion/gsap";

export function HeroParallax({ className = "", ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { gsap } = getGsap();
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return <div ref={ref} className={className} {...props} />;
}

