import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { formatDesignNumber, getDesignPublicPath } from "@/lib/designSlug";
import { listDesigns } from "@/lib/designs";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Property pages",
  description: "YardCraft property preview pages.",
};

export default async function Page() {
  const designs = await listDesigns();

  return (
    <div className="py-10 sm:py-14">
      <Container className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-3xl font-semibold leading-[1.08] tracking-[-0.01em] text-foreground">
            Property pages
          </h1>
          <p className="text-sm text-muted">
            Public URLs like <code className="text-foreground">/dmv0001</code>
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Link className="text-muted hover:text-foreground transition" href="/">
            Home
          </Link>
          <Link
            className="text-muted hover:text-foreground transition"
            href="/admin/designs"
          >
            Admin
          </Link>
        </div>
      </Container>

      <Container className="mt-8">
        {designs.length === 0 ? (
          <p className="text-sm text-muted">No properties yet. Create one in the admin dashboard.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {designs.map((d) => (
              <Link
                key={d.slug}
                href={getDesignPublicPath(d.slug)}
                className="group rounded-3xl border border-card-border bg-card p-6 transition hover:border-[color-mix(in_oklab,var(--gold)_35%,var(--card-border))]"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-base font-semibold tracking-tight text-foreground">
                    Property {formatDesignNumber(d.slug)}
                  </h2>
                  <span className="text-xs text-muted group-hover:text-foreground transition">
                    View →
                  </span>
                </div>
                <p className="mt-2 font-mono text-sm text-muted">{getDesignPublicPath(d.slug)}</p>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
