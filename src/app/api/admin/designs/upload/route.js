import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/supabaseAdmin";
import {
  parseUploadKind,
  parseUploadSlug,
  uploadDesignFileBuffer,
} from "@/lib/adminUpload";
import { requireAdminApi } from "@/lib/authApi";
import { getDesignBySlug } from "@/lib/designs";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Legacy multipart fallback — prefer init + direct-to-storage + complete from the admin UI. */
export async function POST(request) {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "supabase_not_configured" },
      { status: 500 },
    );
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { ok: false, error: "expected_multipart_form_data" },
      { status: 415 },
    );
  }

  const form = await request.formData();
  const slug = parseUploadSlug(form.get("slug"));
  const kind = parseUploadKind(form.get("kind"));
  const file = form.get("file");

  if (!slug) {
    return NextResponse.json(
      { ok: false, error: "invalid_slug", message: "Numeric design id required (e.g. design9)." },
      { status: 400 },
    );
  }
  if (!kind) {
    return NextResponse.json({ ok: false, error: "invalid_kind" }, { status: 400 });
  }
  if (!file || typeof file === "string") {
    return NextResponse.json({ ok: false, error: "missing_file" }, { status: 400 });
  }

  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const existing = await getDesignBySlug(slug);
    const previousUrl =
      kind === "before" ? existing?.before_image || "" : existing?.after_image || "";

    const result = await uploadDesignFileBuffer({
      slug,
      kind,
      fileName: file.name || "upload.jpg",
      fileSize: file.size,
      contentType: file.type || "",
      bytes,
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
