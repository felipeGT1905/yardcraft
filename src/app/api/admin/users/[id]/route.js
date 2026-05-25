import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/authApi";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

/* ── DELETE /api/admin/users/[id] ───────────────────────────────
   Permanently deletes a user from both the profiles table and
   Supabase Auth. Cannot be used on yourself.
──────────────────────────────────────────────────────────────── */
export async function DELETE(_req, { params }) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  if (!id || typeof id !== "string") {
    return NextResponse.json({ ok: false, error: "User ID is required." }, { status: 400 });
  }

  if (id === auth.user.id) {
    return NextResponse.json({ ok: false, error: "You cannot delete your own account." }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Supabase not configured." }, { status: 503 });
  }

  const admin = getSupabaseAdmin();

  // Delete profile first in case there is no cascade on the foreign key.
  await admin.from("profiles").delete().eq("id", id);

  // Delete the auth user — this is the permanent removal.
  const { error } = await admin.auth.admin.deleteUser(id);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
