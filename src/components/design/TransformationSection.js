import { Button } from "@/components/ui/Button";
import { BeforeAfterSlider } from "@/components/design/BeforeAfterSlider";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";

export function TransformationSection({
  id = "before-after",
  beforeUrl,
  afterUrl,
  missingHint = null,
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <Reveal className="flex flex-wrap items-center gap-2" y={10} duration={0.75}>
            <span className="rounded-full border border-card-border bg-black/10 px-3 py-1 text-[11px] font-medium tracking-wide text-muted">
              Before / After
            </span>
            <span className="rounded-full border border-card-border bg-black/10 px-3 py-1 text-[11px] font-medium tracking-wide text-muted">
              Luxury contrast
            </span>
            <span className="rounded-full border border-card-border bg-black/10 px-3 py-1 text-[11px] font-medium tracking-wide text-muted">
              Night-ready lighting
            </span>
          </Reveal>

          <Reveal
            as="h2"
            className="mt-3 font-serif text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.01em] text-foreground sm:text-4xl"
          >
            Before → After transformation
          </Reveal>
          <Reveal
            as="p"
            className="mt-2 max-w-[62ch] text-sm leading-6 text-muted sm:text-base sm:leading-7"
            y={12}
          >
            Crisp borders. Higher contrast. Clean geometry. The kind of curb appeal that makes a
            home feel premium the second you pull in.
          </Reveal>
        </div>

        <Reveal className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3" y={10} duration={0.85}>
          <Button href="#services" variant="secondary" className="w-full justify-center sm:w-auto">
            What’s included
          </Button>
          <Button href="#quote" className="w-full justify-center sm:w-auto">
            Request Your Custom Plan
          </Button>
        </Reveal>
      </div>

      <Reveal className="mt-6 rounded-3xl border border-card-border bg-card p-4 sm:p-6" y={16} duration={0.95}>
        <div className="grid gap-4 lg:grid-cols-[1fr_260px] lg:items-start">
          <BeforeAfterSlider
            beforeUrl={beforeUrl}
            afterUrl={afterUrl}
            beforeLabel="Before"
            afterLabel="After"
            className="bg-black/0 border-0 p-0"
            heightClassName="h-[320px] sm:h-[520px]"
            aspect="16/10"
          />

          <aside className="rounded-3xl border border-card-border bg-black/10 p-5">
            <div className="text-xs font-medium tracking-[0.14em] uppercase text-muted">
              What changed
            </div>
            <Stagger className="mt-4 grid gap-3" stagger={0.08} y={10}>
              <MiniStat title="Borders" body="Crisp edges, clean geometry" />
              <MiniStat title="Materials" body="Premium stone + contrast" />
              <MiniStat title="Lighting" body="Warm layers after sunset" />
            </Stagger>

            <div className="mt-4 rounded-2xl border border-card-border bg-card px-4 py-3 text-xs text-muted">
              This is the exact “before/after moment” homeowners care about.
            </div>
          </aside>
        </div>

        {missingHint ? (
          <div className="mt-4 rounded-2xl border border-card-border bg-black/10 px-4 py-3 text-xs text-muted">
            {missingHint}
          </div>
        ) : null}
      </Reveal>
    </section>
  );
}

function MiniStat({ title, body }) {
  return (
    <div data-stagger className="rounded-2xl border border-card-border bg-card p-4">
      <div className="text-[11px] font-medium tracking-wide text-muted">{title}</div>
      <div className="mt-2 text-sm font-semibold tracking-tight text-foreground">
        {body}
      </div>
    </div>
  );
}

