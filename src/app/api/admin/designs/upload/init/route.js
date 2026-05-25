import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/supabaseAdmin";
import {
  initDesignUpload,
  parseUploadKind,
  parseUploadSlug,
} from "@/lib/adminUpload";
import { requireAdminApi } from "@/lib/authApi";

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
  const fileName = typeof body?.fileName === "string" ? body.fileName : "";
  const fileSize = Number(body?.fileSize);
  const contentType = typeof body?.contentType === "string" ? body.contentType : "";

  if (!slug) {
    return NextResponse.json(
      { ok: false, error: "invalid_slug", message: "Numeric design id required (e.g. design9)." },
      { status: 400 },
    );
  }
  if (!kind) {
    return NextResponse.json({ ok: false, error: "invalid_kind" }, { status: 400 });
  }

  try {
    const result = await initDesignUpload({ slug, kind, fileName, fileSize, contentType });
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
