import { NextResponse } from "next/server";

import { getEmployeeBySlug } from "@/lib/employees";
import { isValidEmployeeSlug } from "@/lib/employeeSlug";
import { buildEmployeeVCard } from "@/lib/vcard";
import { loadEmployeeVCardPhoto } from "@/lib/vcardPhoto";

export async function GET(_request, { params }) {
  const { slug } = await params;
  if (!isValidEmployeeSlug(slug)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const employee = await getEmployeeBySlug(slug);
  if (!employee || !employee.is_published) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const photo = await loadEmployeeVCardPhoto(employee.photo_url);
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
