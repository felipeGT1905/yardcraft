import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";

export function PersuasiveSection() {
  return (
    <section className="py-10 sm:py-14">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <Reveal className="rounded-3xl border border-card-border bg-card p-6 sm:p-8" y={16}>
            <div className="text-xs font-medium tracking-[0.14em] uppercase text-muted">
              Beauty • Comfort • Home value
            </div>
            <Reveal
              as="h2"
              className="mt-2 font-serif text-pretty text-3xl font-semibold leading-[1.08] tracking-[-0.01em] text-foreground sm:text-4xl"
              y={12}
              duration={0.9}
            >
              The yard should feel like a luxury extension of the home.
            </Reveal>
            <Reveal
              as="p"
              className="mt-3 max-w-[62ch] text-sm leading-6 text-muted sm:text-base sm:leading-7"
              y={12}
              duration={0.85}
            >
              A premium exterior isn’t about “more stuff.” It’s about restraint, contrast, and
              clean lines — the kind of finish that makes the entire property look higher-end.
              We design outdoor spaces that are beautiful to live in and strong for resale.
            </Reveal>

            <Stagger className="mt-6 grid gap-3 sm:grid-cols-2" stagger={0.07} y={10}>
              <Point title="Expensive-looking contrast">
                Dark mulch + premium stone + crisp borders that read luxury instantly.
              </Point>
              <Point title="Comfortable outdoor living">
                Patios, walkways, and gathering spaces designed for real use.
              </Point>
              <Point title="Low-maintenance clarity">
                Intentional plantings and clean edges — less chaos, fewer weekends lost.
              </Point>
              <Point title="Night-ready lighting">
                Warm layers that perform after sunset and elevate the entire facade.
              </Point>
            </Stagger>
          </Reveal>

          <Reveal className="rounded-3xl border border-card-border bg-black/10 p-6 sm:p-8" y={16} delay={0.03}>
            <div className="text-xs font-medium tracking-[0.14em] uppercase text-muted">
              Premium promise
            </div>
            <Stagger className="mt-4 grid gap-3" stagger={0.08} y={10}>
              <Card title="Clear scope">
                You’ll know what’s included, what’s not, and what it costs — upfront.
              </Card>
              <Card title="Clean execution">
                Respectful crews, tidy job sites, and a finish you can feel proud of.
              </Card>
              <Card title="Materials that age well">
                We spec products that stay premium after weather and seasons.
              </Card>
            </Stagger>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function Point({ title, children }) {
  return (
    <div
      data-stagger
      className="rounded-2xl border border-card-border bg-black/10 p-4 transition hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--gold)_35%,var(--card-border))]"
    >
      <div className="text-sm font-semibold tracking-tight text-foreground">{title}</div>
      <div className="mt-2 text-sm leading-6 text-muted">{children}</div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div data-stagger className="rounded-2xl border border-card-border bg-card p-5">
      <div className="text-sm font-semibold tracking-tight text-foreground">{title}</div>
      <div className="mt-2 text-sm leading-6 text-muted">{children}</div>
    </div>
  );
}

