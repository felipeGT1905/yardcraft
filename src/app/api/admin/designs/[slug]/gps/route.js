import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/authApi";
import { getDesignBySlug } from "@/lib/designs";
import { readGpsFromImageUrl } from "@/lib/imageGps";
import { resolveDesignSlug } from "@/lib/designSlug";

export async function GET(_request, { params }) {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;

  const { slug: rawSlug } = await params;
  const slug = resolveDesignSlug(rawSlug);
  if (!slug) {
    return NextResponse.json({ ok: false, error: "invalid_slug" }, { status: 400 });
  }

  const design = await getDesignBySlug(slug);
  if (!design) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  // Sequential: Nominatim allows ~1 request/sec; each readGpsFromImageUrl geocodes after EXIF.
  const before = design.before_image
    ? await readGpsFromImageUrl(design.before_image)
    : { found: false };
  const after = design.after_image
    ? await readGpsFromImageUrl(design.after_image)
    : { found: false };

  return NextResponse.json({
    ok: true,
    slug,
    before,
    after,
  });
}
