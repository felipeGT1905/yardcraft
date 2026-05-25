"use client";

import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/motion/gsap";

export function Reveal({
  as: As = "div",
  children,
  className = "",
  y = 18,
  duration = 0.9,
  delay = 0,
  once = true,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { gsap } = getGsap();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            once,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [delay, duration, once, y]);

  return (
    <As ref={ref} className={className}>
      {children}
    </As>
  );
}

