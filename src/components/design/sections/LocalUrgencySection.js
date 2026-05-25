import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";

export function LocalUrgencySection() {
  return (
    <section className="py-10 sm:py-14">
      <Container>
        <Reveal className="relative overflow-hidden rounded-3xl border border-card-border bg-card p-6 sm:p-10" y={16}>
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 -top-24 h-[340px] w-[340px] rounded-full bg-green/10 blur-3xl" />
            <div className="absolute -right-24 bottom-[-140px] h-[380px] w-[380px] rounded-full bg-gold/10 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.35),transparent_55%)]" />
          </div>

          <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <Reveal className="flex flex-wrap items-center gap-2" y={10} duration={0.75}>
                <Badge className="text-foreground/85">Local</Badge>
                <span className="rounded-full border border-card-border bg-black/10 px-3 py-1 text-[11px] font-medium tracking-wide text-muted">
                  Currently Serving Your Neighborhood
                </span>
              </Reveal>
              <Reveal
                as="h2"
                className="mt-3 font-serif text-pretty text-3xl font-semibold leading-[1.08] tracking-[-0.01em] text-foreground sm:text-4xl"
              >
                Premium scheduling slots fill quickly in peak season.
              </Reveal>
              <Reveal
                as="p"
                className="mt-2 max-w-[62ch] text-sm leading-6 text-muted sm:text-base sm:leading-7"
                y={12}
              >
                If you want the yard finished before the next hosting season, request your consult
                now. We’ll confirm feasibility, timeline, and a budget range — with a clean scope
                and no surprises.
              </Reveal>
            </div>

            <Stagger className="grid gap-3" stagger={0.08} y={10}>
              <Pill title="Consult" body="48-hour scheduling" />
              <Pill title="Plan" body="Clear scope + materials" />
              <Pill title="Build" body="Premium details + lighting" />
            </Stagger>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function Pill({ title, body }) {
  return (
    <div data-stagger className="rounded-2xl border border-card-border bg-black/10 px-4 py-3">
      <div className="text-[11px] font-medium tracking-wide text-muted">{title}</div>
      <div className="mt-1 text-sm font-semibold tracking-tight text-foreground">{body}</div>
    </div>
  );
}

