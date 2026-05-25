import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { BRAND } from "@/lib/brand";

export function Hero({ content }) {
  return (
    <section className="relative flex min-h-[92vh] items-end overflow-hidden pb-20 sm:min-h-screen sm:items-center sm:pb-0">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.png"
          alt="Premium outdoor landscaping by YardCraft"
          fill
          className="yc-lux-photo yc-lux-photo-hero object-cover object-[88%_40%] sm:object-center"
          priority
        />
        <div className="yc-lux-photo-warmth yc-lux-photo-warmth-hero" aria-hidden="true" />
        {/* Mobile overlay: light at top (reveals yard/home), dark at bottom (text legibility) */}
        <div className="absolute inset-0 sm:hidden bg-[linear-gradient(to_bottom,rgba(5,5,6,0.18)_0%,rgba(5,5,6,0.48)_50%,rgba(5,5,6,0.88)_100%)]" />
        {/* Desktop overlay: heavy on left for text legibility, reveals scene on right */}
        <div className="absolute inset-0 hidden sm:block bg-[linear-gradient(100deg,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.72)_38%,rgba(0,0,0,0.35)_65%,rgba(0,0,0,0.12)_100%)]" />
        {/* Bottom vignette for depth */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(to_top,rgba(5,5,6,0.85),transparent)]" />
        {/* Top vignette */}
        <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(to_bottom,rgba(5,5,6,0.45),transparent)]" />
        {/* Subtle scene glow — kept neutral so hero reads less yellow/orange */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_68%_62%,rgba(180,190,210,0.05),transparent_60%)]" />
      </div>

      <Container className="relative z-10 py-24 sm:py-28 lg:py-36">
        <div className="max-w-[560px] sm:max-w-[44rem]">
          {/* Eyebrow */}
          <p className="mb-5 text-[11px] font-semibold tracking-[0.2em] uppercase text-foreground/60 sm:text-xs">
            {content.eyebrow}
          </p>

          {/* Headline */}
          <h1 className="font-serif text-[3.25rem] font-semibold leading-[0.94] tracking-[-0.025em] text-foreground sm:text-[4.5rem] lg:text-[5.25rem]">
            <span className="block sm:whitespace-nowrap">Premium Outdoor</span>
            <span className="block sm:whitespace-nowrap">Transformations</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-[46ch] text-pretty text-[15px] leading-[1.75] text-foreground/65 sm:text-base sm:leading-[1.8]">
            {content.subtitle}
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <Button href={content.primaryCta.href} className="px-5 py-2.5 text-[13px]">
              {content.primaryCta.label}
            </Button>
            <a
              href={content.secondaryCta.href}
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-2.5 text-[13px] font-medium tracking-[0.02em] text-foreground/80 transition hover:border-white/50 hover:bg-white/6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
            >
              {content.secondaryCta.label}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
