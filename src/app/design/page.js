import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { designs } from "@/content/designs";

export const metadata = {
  title: "Design pages",
  description: "Dynamic design page examples for your project.",
};

export default function Page() {
  return (
    <div className="py-10 sm:py-14">
      <Container className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-3xl font-semibold leading-[1.08] tracking-[-0.01em] text-foreground">
            Design pages
          </h1>
          <p className="text-sm text-muted">
            Dynamic routes at <code className="text-foreground">/design/[slug]</code>
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Link className="text-muted hover:text-foreground transition" href="/">
            Home
          </Link>
          <Link
            className="text-muted hover:text-foreground transition"
            href="/admin"
          >
            Admin
          </Link>
        </div>
      </Container>

      <Container className="mt-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {designs.map((d) => (
            <Link
              key={d.slug}
              href={`/design/${d.slug}`}
              className="group rounded-3xl border border-card-border bg-card p-6 transition hover:border-[color-mix(in_oklab,var(--gold)_35%,var(--card-border))]"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-base font-semibold tracking-tight text-foreground">
                  {d.name}
                </h2>
                <span className="text-xs text-muted group-hover:text-foreground transition">
                  View →
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">{d.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {d.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-card-border bg-black/10 px-3 py-1 text-xs text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}

