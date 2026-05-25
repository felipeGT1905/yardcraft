import "server-only";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getSessionUser() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) return { supabase, user: null };
    return { supabase, user: data?.user ?? null };
  } catch (error) {
    return { supabase: null, user: null, error };
  }
}

export async function getProfileRole(userId) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    if (error) return null;
    return data?.role ?? null;
  } catch {
    return null;
  }
}

export async function requireAdmin({ redirectTo = "/admin/login" } = {}) {
  const { supabase, user, error } = await getSessionUser();
  if (error || !supabase) {
    redirect(`${redirectTo}?error=supabase_not_configured`);
  }
  if (!user) redirect(redirectTo);

  let data = null;
  let profileError = null;
  try {
    const result = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    data = result.data;
    profileError = result.error;
  } catch (err) {
    profileError = err;
  }

  if (profileError || data?.role !== "admin") redirect(redirectTo);

  return { supabase, user, role: "admin" };
}

