import { NextResponse } from "next/server";

import { getEmployeeBySlug } from "@/lib/employees";
import { isValidEmployeeSlug } from "@/lib/employeeSlug";
import { buildEmployeeVCard } from "@/lib/vcard";
import { loadEmployeeVCardPhoto } from "@/lib/vcardPhoto";

export const runtime = "nodejs";

function requestOrigin(request) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost.split(",")[0].trim()}`;
  }

  return new URL(request.url).origin;
}

export async function GET(request, { params }) {
  const { slug } = await params;
  if (!isValidEmployeeSlug(slug)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const employee = await getEmployeeBySlug(slug);
  if (!employee || !employee.is_published) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const photo = await loadEmployeeVCardPhoto(employee.photo_url, {
    origin: requestOrigin(request),
  });
  const vcf = buildEmployeeVCard(employee, photo);
  const filename = `${employee.slug}.vcf`;

  return new NextResponse(vcf, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
