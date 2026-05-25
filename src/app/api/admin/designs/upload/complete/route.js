import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/supabaseAdmin";
import {
  finalizeDesignUpload,
  parseUploadKind,
  parseUploadSlug,
} from "@/lib/adminUpload";
import { requireAdminApi } from "@/lib/authApi";
import { getDesignBySlug } from "@/lib/designs";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request) {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "supabase_not_configured" },
      { status: 500 },
    );
  }

  let body = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const slug = parseUploadSlug(body?.slug);
  const kind = parseUploadKind(body?.kind);
  const path = typeof body?.path === "string" ? body.path.trim() : "";

  if (!slug) {
    return NextResponse.json(
      { ok: false, error: "invalid_slug", message: "Numeric design id required (e.g. design9)." },
      { status: 400 },
    );
  }
  if (!kind) {
    return NextResponse.json({ ok: false, error: "invalid_kind" }, { status: 400 });
  }
  if (!path) {
    return NextResponse.json({ ok: false, error: "missing_path" }, { status: 400 });
  }

  try {
    const existing = await getDesignBySlug(slug);
    const previousUrl =
      kind === "before" ? existing?.before_image || "" : existing?.after_image || "";

    const result = await finalizeDesignUpload({
      slug,
      kind,
      path,
      userId: gate.user?.id,
      previousUrl,
    });

    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "unexpected_error", message: err?.message ?? "unknown" },
      { status: 500 },
    );
  }
}
