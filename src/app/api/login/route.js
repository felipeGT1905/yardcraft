import { NextResponse } from "next/server";

export async function POST(request) {
  let body = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, error: "missing_credentials" },
      { status: 400 },
    );
  }

  // Stub auth. Replace with your auth provider / DB lookup.
  const token = Buffer.from(`${email}:${Date.now()}`).toString("base64url");

  return NextResponse.json({
    ok: true,
    token,
    user: { email },
  });
}

