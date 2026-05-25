"use client";

import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/motion/gsap";

export function Stagger({
  as: As = "div",
  children,
  className = "",
  selector = "[data-stagger]",
  y = 14,
  duration = 0.75,
  stagger = 0.06,
  once = true,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { gsap } = getGsap();

    const ctx = gsap.context(() => {
      const items = el.querySelectorAll(selector);
      if (!items.length) return;

      gsap.fromTo(
        items,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          ease: "power3.out",
          stagger,
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            once,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [duration, once, selector, stagger, y]);

  return (
    <As ref={ref} className={className}>
      {children}
    </As>
  );
}

