import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { BRAND } from "@/lib/brand";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { QuoteIqEmbed } from "@/components/quoteiq/QuoteIqEmbed";

export function ContactCtaSection({ source } = {}) {
  return (
    <section id="quote" className="scroll-mt-24 py-10 sm:py-14">
      <Container>
        <Reveal className="rounded-3xl border border-card-border bg-card p-6 sm:p-10" y={16}>
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <div className="text-xs font-medium tracking-[0.14em] uppercase text-muted">
                Contact / Free estimate
              </div>
              <Reveal
                as="h2"
                className="mt-2 font-serif text-pretty text-3xl font-semibold leading-[1.08] tracking-[-0.01em] text-foreground sm:text-4xl"
                y={12}
                duration={0.9}
              >
                Ready for a premium yard you’ll love coming home to?
              </Reveal>
              <Reveal
                as="p"
                className="mt-3 max-w-[62ch] text-sm leading-6 text-muted sm:text-base sm:leading-7"
                y={12}
              >
                Call or text now for a fast consult. We’ll confirm feasibility, timeline, and a
                budget range — then build it clean with premium materials and details.
              </Reveal>

              <Stagger className="mt-6 grid gap-3 sm:grid-cols-2" stagger={0.07} y={10}>
                <Button data-stagger href="#quoteiq" className="w-full justify-center">
                  Request Your Custom Plan
                </Button>
                <a
                  data-stagger
                  href={`tel:${BRAND.phoneTel}`}
                  className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-[13px] font-semibold tracking-[0.04em] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition hover:border-white/55 hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Call Now
                </a>
              </Stagger>

              <Reveal className="mt-4 text-sm text-muted" y={10} duration={0.8}>
                Phone: <span className="text-foreground">{BRAND.phoneDisplay}</span>
              </Reveal>
            </div>

            <div
              id="quoteiq"
              className="relative overflow-hidden rounded-3xl border border-card-border bg-black/10 p-6"
            >
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -right-24 -top-24 h-[280px] w-[280px] rounded-full bg-green/10 blur-3xl" />
                <div className="absolute -left-24 bottom-[-140px] h-[340px] w-[340px] rounded-full bg-gold/10 blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.22),transparent_60%)]" />
              </div>

              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-medium tracking-[0.14em] uppercase text-muted">
                      Instant estimate
                    </div>
                    <div className="mt-1 text-sm font-semibold tracking-tight text-foreground">
                      Get a fast budget range + timeline
                    </div>
                  </div>
                  <span className="rounded-full border border-card-border bg-background/70 px-3 py-1 text-[11px] text-muted">
                    Embed
                  </span>
                </div>

                <Reveal className="mt-4 rounded-2xl border border-card-border bg-card p-5" y={12} duration={0.9}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-sm text-muted">
                      Answer a few quick questions to get a fast budget range.
                    </div>
                    <span className="rounded-full border border-card-border bg-black/10 px-3 py-1 text-[11px] text-muted">
                      Secure
                    </span>
                  </div>

                  <div className="mt-4">
                    <QuoteIqEmbed slug={source?.slug || ""} pageUrl={source?.pageUrl || ""} />
                  </div>
                </Reveal>

                <Stagger className="mt-4 grid gap-2" stagger={0.07} y={10}>
                  <Button
                    data-stagger
                    href="#before-after"
                    variant="secondary"
                    className="w-full justify-center"
                  >
                    Recheck before/after
                  </Button>
                  <a
                    data-stagger
                    href={`tel:${BRAND.phoneTel}`}
                    className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-[13px] font-semibold tracking-[0.04em] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition hover:border-white/55 hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    Call Now
                  </a>
                </Stagger>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

