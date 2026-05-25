import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "luxury-next14",
    time: new Date().toISOString(),
  });
}

