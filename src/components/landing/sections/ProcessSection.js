import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";

export function ProcessSection({ id, label, title, items }) {
  return (
    <section id={id} className="relative scroll-mt-20 py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-175 w-175 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(214,178,94,0.05)_0%,transparent_65%)]" />
      </div>

      <Container>
        {/* Header */}
        <div className="mb-14 text-center sm:mb-16">
          <Reveal>
            <p className="mb-3 text-[11px] font-semibold tracking-[0.2em] uppercase text-gold/80">
              {label}
            </p>
          </Reveal>
          <Reveal
            as="h2"
            className="font-serif text-pretty text-3xl font-semibold leading-[1.1] tracking-[-0.01em] text-foreground sm:text-[2.5rem]"
          >
            {title.split("\n").map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </Reveal>
        </div>

        {/* Steps */}
        <div className="relative grid gap-10 sm:grid-cols-3 sm:gap-6">
          {/* Connector line between number rings — desktop only */}
          <div
            aria-hidden="true"
            className="absolute top-7 hidden h-px sm:block"
            style={{
              left: "calc(16.67% + 2rem)",
              right: "calc(16.67% + 2rem)",
              background: "linear-gradient(to right, rgba(214,178,94,0.3), rgba(214,178,94,0.12), rgba(214,178,94,0.3))",
            }}
          />

          <Stagger className="contents">
            {items.map((item, i) => (
              <div
                key={item.title}
                data-stagger
                className="flex flex-col items-center text-center"
              >
                {/* Gold number ring */}
                <div className="relative z-10 grid h-14 w-14 place-items-center rounded-full border border-gold/35 bg-card text-lg font-semibold tracking-tight text-gold shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_8px_24px_-8px_rgba(0,0,0,0.6),0_0_20px_-8px_rgba(214,178,94,0.18)]">
                  0{i + 1}
                </div>

                {/* Title */}
                <h3 className="mt-5 text-base font-semibold tracking-tight text-foreground">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="mt-2.5 max-w-[26ch] text-sm leading-[1.7] text-muted">
                  {item.description}
                </p>
              </div>
            ))}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}
