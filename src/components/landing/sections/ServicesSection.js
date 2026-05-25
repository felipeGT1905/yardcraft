import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";

export function ServicesSection({ id, label, title, items }) {
  return (
    <section id={id} className="relative scroll-mt-20 py-16 sm:py-24">
      <Container>
        {/* Header */}
        <div className="mb-10 text-center sm:mb-12">
          <Reveal>
            <p className="mb-3 text-[11px] font-semibold tracking-[0.2em] uppercase text-gold">
              {label}
            </p>
          </Reveal>
          <Reveal
            as="h2"
            className="font-serif text-pretty text-3xl font-semibold leading-[1.1] tracking-[-0.01em] text-foreground sm:text-[2.5rem]"
          >
            {title}
          </Reveal>
        </div>

        {/* 6-column grid — horizontally scrollable on mobile */}
        <div className="overflow-x-auto pb-2">
          <Stagger className="grid min-w-225 grid-cols-6 gap-3 sm:min-w-0 lg:gap-4">
            {items.map((item) => (
              <ServiceCard key={item.title} item={item} />
            ))}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}

function ServiceCard({ item }) {
  return (
    <a
      href={item.href}
      data-stagger
      className="group relative flex h-72 flex-col justify-end overflow-hidden rounded-2xl border border-white/10 transition duration-500 ease-out hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_28px_60px_-20px_rgba(0,0,0,0.88)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/55"
    >
      {/* Background image — zooms subtly on hover */}
      <div className="absolute inset-0">
        <div className="relative h-full w-full transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.06]">
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 280px, (max-width: 1200px) 20vw, 17vw"
            className="yc-lux-photo object-cover object-center"
          />
        </div>
      </div>

      {/* Cinematic overlay — warm, dark at bottom, breathes on hover */}
      <div className="absolute inset-0 bg-linear-to-t from-black/72 via-black/36 to-black/12 transition-opacity duration-500 group-hover:opacity-90" />

      {/* Subtle gold warmth glow at base on hover */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(ellipse_90%_60%_at_50%_110%,rgba(214,178,94,0.10),transparent_70%)]" />

      {/* Text content */}
      <div className="relative p-4">
        <h3 className="text-[13px] font-semibold leading-snug tracking-tight text-foreground">
          {item.title}
        </h3>
        <p className="mt-1.5 text-[11px] leading-[1.55] text-foreground/55">
          {item.description}
        </p>
        <div className="mt-3 text-foreground/35 transition-colors duration-300 group-hover:text-gold/65">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </a>
  );
}
