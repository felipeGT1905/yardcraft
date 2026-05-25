import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BRAND } from "@/lib/brand";
import { Logo } from "@/components/site/Logo";
import { BeforeAfterSlider } from "@/components/design/BeforeAfterSlider";
import { Reveal } from "@/components/motion/Reveal";
import { HeroParallax } from "@/components/motion/HeroParallax";

export function DesignHeroSection({ slug, beforeUrl, afterUrl }) {
  return (
    <section className="relative overflow-hidden border-b border-card-border/70">
      <div className="absolute inset-0">
        {afterUrl ? (
          <>
            <HeroParallax
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${afterUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div
              className="absolute inset-0 scale-[1.06] opacity-35 blur-2xl"
              style={{
                backgroundImage: `url(${afterUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </>
        ) : null}
        <div className="absolute -top-44 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute top-20 left-[-220px] h-[520px] w-[520px] rounded-full bg-green/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_50%_-160px,rgba(214,178,94,0.18),transparent_60%)]" />
        {/* Door-hanger style: dark premium overlay + warm lighting + vignette */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.78),rgba(0,0,0,0.55)_40%,rgba(0,0,0,0.84))]" />
        <div className="absolute inset-0 bg-[radial-gradient(1100px_520px_at_50%_18%,rgba(214,178,94,0.18),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_50%_85%,rgba(31,122,58,0.14),transparent_60%)]" />
        <div className="lux-animated-overlay absolute inset-0 opacity-60 bg-[radial-gradient(800px_420px_at_20%_20%,rgba(214,178,94,0.10),transparent_55%),radial-gradient(700px_380px_at_85%_15%,rgba(31,122,58,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.65)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--green)_45%,transparent),color-mix(in_oklab,var(--gold)_45%,transparent),transparent)]" />
      </div>

      <Container className="relative py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="flex flex-col gap-6">
            <Reveal className="flex flex-wrap items-center gap-2" y={10} duration={0.7}>
              <Badge className="text-foreground/85">Your YardCraft Preview</Badge>
              <span className="rounded-full border border-card-border bg-black/10 px-3 py-1 text-[11px] font-medium tracking-wide text-muted">
                Northern Virginia
              </span>
              <span className="rounded-full border border-card-border bg-black/10 px-3 py-1 text-[11px] font-medium tracking-wide text-muted">
                Licensed • Insured • Local
              </span>
            </Reveal>

            <Reveal
              as="h1"
              className="font-serif text-balance text-4xl font-semibold leading-[0.98] tracking-[-0.02em] text-foreground sm:text-6xl"
              y={18}
              duration={0.95}
            >
              <span className="block">One Possibility…</span>
              <span className="block">
                Build Your{" "}
                <span className="bg-[linear-gradient(90deg,color-mix(in_oklab,var(--green-bright)_75%,white),var(--green),var(--gold))] bg-clip-text text-transparent">
                  Dream
                </span>
                .
              </span>
            </Reveal>

            <Reveal
              as="p"
              className="max-w-[62ch] text-pretty text-base leading-7 text-muted sm:text-lg sm:leading-8"
              y={14}
              duration={0.85}
              delay={0.05}
            >
              This AI-generated transformation is just one idea. Our team can custom-design and
              build the perfect outdoor space for your home — with premium materials, clean
              borders, and lighting that feels expensive after sunset.
            </Reveal>

            <Reveal className="grid gap-3 sm:grid-cols-2 sm:gap-4" y={12} duration={0.85} delay={0.08}>
              <Button href="#quote" className="w-full justify-center">
                Request Your Custom Plan
              </Button>
              <a
                href={`tel:${BRAND.phoneTel}`}
                className="inline-flex items-center justify-center rounded-full border border-white/45 bg-white/14 px-6 py-3.5 text-[13px] font-semibold tracking-[0.04em] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_12px_40px_-24px_rgba(0,0,0,0.45)] transition hover:border-white/60 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Call Now
              </a>
            </Reveal>

            <Reveal className="flex flex-wrap items-center gap-3 text-sm text-muted" y={10} duration={0.8} delay={0.12}>
              <span className="rounded-full border border-card-border bg-black/10 px-3 py-2 text-xs">
                {BRAND.phoneDisplay}
              </span>
              <span className="text-xs">
                Personalized for your property • Fast consult • Premium finish
              </span>
            </Reveal>
          </div>

          <Reveal className="rounded-3xl border border-card-border bg-card p-4 sm:p-6" y={16} duration={0.9}>
            <div className="flex items-start justify-between gap-3 px-2 pb-3">
              <div>
                <div className="text-xs font-medium tracking-wide text-muted">
                  Before → After
                </div>
                <div className="mt-1 text-sm font-semibold tracking-tight text-foreground">
                  Your transformation preview
                </div>
              </div>
              <div className="hidden sm:block">
                <Logo variant="mark" />
              </div>
            </div>

            <BeforeAfterSlider
              beforeUrl={beforeUrl}
              afterUrl={afterUrl}
              beforeLabel="Before"
              afterLabel="After"
              heightClassName="h-[340px] sm:h-[520px]"
              aspect="16/10"
            />

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <InfoRow title="Consult" value="48h" />
              <InfoRow title="Scope" value="Clear" />
              <InfoRow title="Finish" value="Premium" />
            </div>

            <div className="mt-4 rounded-2xl border border-card-border bg-black/10 px-4 py-3 text-xs text-muted">
              Tap “Request Your Custom Plan” for scope, pricing context, and the right next step.
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function InfoRow({ title, value }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-card-border bg-black/10 px-4 py-3">
      <div className="text-xs font-medium tracking-wide text-muted">{title}</div>
      <div className="text-sm font-semibold tracking-tight text-foreground">{value}</div>
    </div>
  );
}

