import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function isAdminRequest() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) return false;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .maybeSingle();

    if (profileError) return false;
    return profile?.role === "admin";
  } catch {
    return false;
  }
}

