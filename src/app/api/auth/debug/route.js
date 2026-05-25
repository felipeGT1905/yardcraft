import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  const user = userData?.user ?? null;

  if (userError || !user) {
    return NextResponse.json(
      { ok: false, error: "unauthorized", userError: userError?.message ?? null },
      { status: 401 },
    );
  }

  let profile = null;
  let profileError = null;
  try {
    const res = await supabase
      .from("profiles")
      .select("id,role,created_at")
      .eq("id", user.id)
      .maybeSingle();
    profile = res.data ?? null;
    profileError = res.error?.message ?? null;
  } catch (e) {
    profile = null;
    profileError = e?.message ?? "unknown";
  }

  return NextResponse.json({
    ok: true,
    user: { id: user.id, email: user.email ?? null },
    profile,
    profileError,
  });
}

