import { NextResponse } from "next/server";

export async function POST(request) {
  const contentType = request.headers.get("content-type") || "";

  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { ok: false, error: "expected_multipart_form_data" },
      { status: 415 },
    );
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json(
      { ok: false, error: "missing_file" },
      { status: 400 },
    );
  }

  // Stub: we intentionally do not persist files in this starter.
  // Replace with S3/R2/GCS upload logic, virus scan, and auth.
  return NextResponse.json({
    ok: true,
    filename: file.name,
    contentType: file.type || null,
    size: file.size,
  });
}

