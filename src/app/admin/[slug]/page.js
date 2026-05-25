import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const sections = [
  {
    slug: "users",
    title: "Users",
    body: "Stub admin section. Add RBAC, listing, invites, and audit logs here.",
  },
  {
    slug: "settings",
    title: "Settings",
    body: "Stub admin section. Add feature flags, billing, and environment config here.",
  },
  {
    slug: "content",
    title: "Content",
    body: "Stub admin section. Add CMS forms and publishing workflows here.",
  },
];

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const section = sections.find((s) => s.slug === slug);
  if (!section) return {};
  return { title: `Admin • ${section.title}` };
}

export default async function Page({ params }) {
  await requireAdmin();
  const { slug } = await params;
  const section = sections.find((s) => s.slug === slug);
  if (!section) notFound();

  return (
    <AdminShell title={section.title}>
      <div className="rounded-2xl border border-card-border bg-black/10 p-5">
        <p className="text-sm text-muted">{section.body}</p>
      </div>
    </AdminShell>
  );
}

