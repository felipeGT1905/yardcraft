import { Suspense } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { listDesigns } from "@/lib/designs";
import { AdminDesignsClient } from "@/components/admin/AdminDesignsClient";
import { requireAdmin } from "@/lib/auth";

export const metadata = {
  title: "Admin • Designs",
  description: "Manage YardCraft design pages (before/after images).",
};

export const dynamic = "force-dynamic";

export default async function Page() {
  await requireAdmin();
  const designs = await listDesigns();

  
  return (
    <AdminShell title="Designs">
      <Suspense fallback={null}>
        <AdminDesignsClient initialDesigns={designs} />
      </Suspense>
    </AdminShell>
  );
}

