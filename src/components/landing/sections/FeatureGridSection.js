import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";

export function FeatureGridSection({ id, title, items }) {
  return (
    <section id={id} className="relative scroll-mt-20 py-12 sm:py-16">
      <Container>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <Reveal
            as="h2"
            className="font-serif text-pretty text-3xl font-semibold leading-[1.08] tracking-[-0.01em] text-foreground sm:text-4xl"
          >
            {title}
          </Reveal>
          <Reveal y={10} duration={0.8}>
            <Link
              href="/design"
              className="hidden text-sm text-muted transition hover:text-foreground sm:inline-flex"
            >
              View examples
            </Link>
          </Reveal>
        </div>

        <Stagger className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.title}
              data-stagger
              className="group rounded-3xl border border-card-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--gold)_40%,var(--card-border))] hover:bg-white/5.5 hover:shadow-[0_22px_65px_-35px_rgba(214,178,94,0.3)]"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <span className="rounded-full border border-card-border bg-black/10 px-3 py-1 text-[11px] text-muted group-hover:text-foreground transition">
                  YardCraft
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">
                {item.description}
              </p>
              <div className="mt-5 h-px w-full bg-card-border/70" />
              <div className="mt-4 text-xs text-muted">
                Premium finish • Clean install • Clear scope
              </div>
            </article>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

