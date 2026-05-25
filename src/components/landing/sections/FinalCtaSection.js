import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { landingOutlineCtaClassName } from "@/components/ui/landingOutlineCta";
import { BRAND } from "@/lib/brand";

export function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/final-cta.png"
          alt="Transform your outdoor space"
          fill
          className="yc-lux-photo object-cover object-center"
        />
        <div className="yc-lux-photo-warmth" aria-hidden="true" />
        {/* Deep cinematic overlay — slightly lighter so photo color reads through */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,5,6,0.48)_0%,rgba(5,5,6,0.44)_50%,rgba(5,5,6,0.68)_100%)]" />
        {/* Warm amber glow from center */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_55%,rgba(180,130,40,0.12),transparent_70%)]" />
      </div>

      <Container className="relative z-10 py-24 text-center sm:py-32">
        <h2 className="font-serif text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.02em] text-foreground sm:text-5xl">
          Ready to transform your outdoor space?
        </h2>
        <p className="mt-3 font-serif text-2xl font-medium italic text-gold sm:text-3xl">
          Let&rsquo;s build it together.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button href="#quote" className="px-7 py-4 text-[13px]">
            Request Your Custom Plan
          </Button>
          <a
            href={`sms:${BRAND.phoneTel}?body=${encodeURIComponent("Hi YardCraft, I'd love to learn more about your outdoor services for my property.")}`}
            className={landingOutlineCtaClassName}
          >
            Text Us
          </a>
        </div>
      </Container>
    </section>
  );
}
