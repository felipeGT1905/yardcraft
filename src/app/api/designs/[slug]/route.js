import { NextResponse } from "next/server";

import { getDesignBySlug, updateDesignBySlug } from "@/lib/designs";
import { requireAdminApi } from "@/lib/authApi";

export async function GET(_request, { params }) {
  const design = await getDesignBySlug(params.slug);
  if (!design) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ design });
}

export async function PATCH(request, { params }) {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;

  let body = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  try {
    const design = await updateDesignBySlug(params.slug, body, { userId: gate.user?.id });
    if (!design) {
      return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, design });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "update_failed", message: err?.message ?? "unknown" },
      { status: 400 },
    );
  }
}

