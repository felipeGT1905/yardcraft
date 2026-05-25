import { Suspense } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { AdminUsersClient } from "@/components/admin/AdminUsersClient";
import { requireAdmin } from "@/lib/auth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin • Users",
  description: "Manage admin team members and invitations.",
};

async function fetchAdminUsers() {
  if (!isSupabaseConfigured()) return [];

  const admin = getSupabaseAdmin();

  const { data: profiles, error: profilesError } = await admin
    .from("profiles")
    .select("id, role")
    .eq("role", "admin");

  if (profilesError || !profiles?.length) return [];

  const { data: authData, error: authError } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (authError) return [];

  const profileIds = new Set(profiles.map((p) => p.id));
  return (authData?.users ?? [])
    .filter((u) => profileIds.has(u.id))
    .map((u) => ({
      id: u.id,
      email: u.email ?? "",
      confirmed: Boolean(u.email_confirmed_at),
      lastSignIn: u.last_sign_in_at ?? null,
      invitedAt: u.invited_at ?? u.created_at ?? null,
    }));
}

export default async function Page() {
  const { user } = await requireAdmin();
  const users = await fetchAdminUsers();

  return (
    <AdminShell title="Users">
      <Suspense fallback={null}>
        <AdminUsersClient initialUsers={users} currentUserId={user.id} />
      </Suspense>
    </AdminShell>
  );
}
