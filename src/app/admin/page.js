import Link from "next/link";

import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { formatDesignNumber } from "@/lib/designSlug";
import { listDesigns } from "@/lib/designs";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin • Overview",
  description: "YardCraft admin overview.",
};

function getStatus(d) {
  const before = Boolean(d?.before_image);
  const after = Boolean(d?.after_image);
  if (before && after) return "ready";
  if (before || after) return "needs";
  return "draft";
}

export default async function Page() {
  await requireAdmin();
  const designs = await listDesigns();

  const total = designs.length;
  const ready = designs.filter((d) => getStatus(d) === "ready").length;
  const needs = designs.filter((d) => getStatus(d) === "needs").length;
  const draft = designs.filter((d) => getStatus(d) === "draft").length;
  const recent = designs.slice(0, 3);

  return (
    <AdminShell title="Overview">
      {/* Stat cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total designs" value={total} tone="neutral" />
        <StatCard label="Ready to share" value={ready} tone="green" />
        <StatCard label="Needs images" value={needs} tone="gold" />
        <StatCard label="Draft" value={draft} tone="muted" />
      </div>

      {/* Quick actions */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <ActionCard
          href="/admin/designs"
          title="Design manager"
          description="Upload before & after images, create slugs, and preview client pages."
          cta="Open Designs"
          tone="green"
        />
        <ActionCard
          href="/"
          title="Public site"
          description="View the live website as a visitor to check the front-end."
          cta="Open Site"
          tone="neutral"
          external
        />
      </div>

      {/* Recent designs */}
      {recent.length > 0 ? (
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-xs font-semibold tracking-[0.14em] uppercase text-muted">
              Recently created
            </div>
            <Link
              href="/admin/designs"
              className="text-xs font-medium text-muted underline-offset-4 transition hover:text-foreground hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {recent.map((d) => (
              <RecentCard key={d.slug} design={d} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-card-border bg-black/10 px-6 py-8 text-center">
          <div className="text-sm font-medium text-muted">No designs yet.</div>
          <Link
            href="/admin/designs"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground underline-offset-4 hover:underline"
          >
            Create your first design →
          </Link>
        </div>
      )}
    </AdminShell>
  );
}

/* ── Sub-components ──────────────────────────────────────────── */

function StatCard({ label, value, tone }) {
  const dot = {
    green: "bg-[color-mix(in_oklab,var(--green-bright)_65%,white)]",
    gold: "bg-[color-mix(in_oklab,var(--gold)_80%,white)]",
    muted: "bg-muted/50",
    neutral: "bg-foreground/30",
  }[tone];

  const num = {
    green: "text-[color-mix(in_oklab,var(--green-bright)_60%,white)]",
    gold: "text-[color-mix(in_oklab,var(--gold)_85%,white)]",
    muted: "text-muted",
    neutral: "text-foreground",
  }[tone];

  return (
    <div className="rounded-2xl border border-card-border bg-black/10 p-5">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
        <span className="text-xs font-medium tracking-[0.14em] uppercase text-muted">{label}</span>
      </div>
      <div className={`mt-3 text-[2.5rem] font-semibold leading-none tracking-tight ${num}`}>
        {value}
      </div>
    </div>
  );
}

function ActionCard({ href, title, description, cta, tone, external }) {
  const ctaClass =
    tone === "green"
      ? "border-[color-mix(in_oklab,var(--green)_40%,var(--card-border))] bg-[color-mix(in_oklab,var(--green)_14%,transparent)] text-foreground hover:bg-[color-mix(in_oklab,var(--green)_20%,transparent)]"
      : "border-card-border bg-white/5 text-foreground hover:bg-white/10";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-card-border bg-black/10 p-5">
      {tone === "green" ? (
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-green/8 blur-2xl" />
      ) : null}
      <div className="relative">
        <div className="text-sm font-semibold tracking-tight text-foreground">{title}</div>
        <p className="mt-1.5 text-xs leading-relaxed text-muted">{description}</p>
        <Link
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className={`mt-4 inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold tracking-wide transition ${ctaClass}`}
        >
          {cta}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

function RecentCard({ design }) {
  const status = getStatus(design);
  const thumb = design.after_image || design.before_image || "";
  const badgeClass = {
    ready: "border-[color-mix(in_oklab,var(--green)_40%,var(--card-border))] bg-[color-mix(in_oklab,var(--green)_10%,transparent)] text-foreground",
    needs: "border-[color-mix(in_oklab,var(--gold)_35%,var(--card-border))] bg-[color-mix(in_oklab,var(--gold)_8%,transparent)] text-foreground",
    draft: "border-card-border bg-black/10 text-muted",
  }[status];
  const badgeLabel = { ready: "Ready", needs: "Needs images", draft: "Draft" }[status];

  return (
    <Link
      href={`/admin/designs?slug=${design.slug}`}
      className="group flex items-center gap-3 rounded-2xl border border-card-border bg-black/10 p-3 transition hover:bg-white/5 hover:border-white/12"
    >
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-card-border bg-black/15">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-[10px] text-muted">—</div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-base font-semibold tabular-nums tracking-tight text-foreground">
          {formatDesignNumber(design.slug)}
        </div>
        <span className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${badgeClass}`}>
          {badgeLabel}
        </span>
      </div>
    </Link>
  );
}
