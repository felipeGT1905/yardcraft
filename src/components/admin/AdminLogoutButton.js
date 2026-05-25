"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AdminLogoutButton() {
  const router = useRouter();
  const { supabase } = useMemo(() => {
    try {
      return { supabase: createSupabaseBrowserClient() };
    } catch {
      return { supabase: null };
    }
  }, []);
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    try {
      if (!supabase) return;
      await supabase.auth.signOut();
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (!supabase) return null;

  return (
    <button
      type="button"
      disabled={busy}
      onClick={logout}
      className="text-sm text-muted hover:text-foreground transition disabled:opacity-50"
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}

