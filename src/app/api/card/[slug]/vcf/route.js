import { NextResponse } from "next/server";

import { getEmployeeBySlug } from "@/lib/employees";
import { isValidEmployeeSlug } from "@/lib/employeeSlug";
import { buildEmployeeVCard, isAndroidUserAgent } from "@/lib/vcard";
import { loadEmployeeVCardPhoto } from "@/lib/vcardPhoto";

export async function GET(request, { params }) {
  const { slug } = await params;
  if (!isValidEmployeeSlug(slug)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const employee = await getEmployeeBySlug(slug);
  if (!employee || !employee.is_published) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const userAgent = request.headers.get("user-agent") || "";
  const android = isAndroidUserAgent(userAgent);
  const photo = await loadEmployeeVCardPhoto(employee.photo_url);
  const vcf = buildEmployeeVCard(employee, photo, { android });
  const filename = `${employee.slug}.vcf`;

  return new NextResponse(vcf, {
    status: 200,
    headers: {
      "Content-Type": android ? "text/x-vcard; charset=utf-8" : "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
