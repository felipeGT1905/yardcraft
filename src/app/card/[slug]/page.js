import { notFound, permanentRedirect } from "next/navigation";

import { EmployeeCardPage } from "@/components/card/EmployeeCardPage";
import { getEmployeeBySlug } from "@/lib/employees";
import {
  canonicalEmployeeSlug,
  getEmployeePublicPath,
  isValidEmployeeSlug,
} from "@/lib/employeeSlug";
import { BRAND } from "@/lib/brand";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (!isValidEmployeeSlug(slug)) return { title: "Not found" };

  const employee = await getEmployeeBySlug(slug);
  if (!employee || !employee.is_published) return { title: "Not found" };

  const name = employee.display_name?.trim() || "Team member";
  const role = employee.job_title?.trim() || BRAND.name;
  const title = `${name} • ${role}`;
  const description = `${name} — ${role} at ${BRAND.name}. ${BRAND.tagline}`;
  const pageUrl = `${getSiteUrl()}${getEmployeePublicPath(employee.slug)}`;
  const photoUrl = employee.photo_url?.trim() || "";

  const openGraph = {
    title,
    description,
    url: pageUrl,
    siteName: BRAND.name,
    type: "profile",
    locale: "en_US",
  };

  if (photoUrl) {
    openGraph.images = [
      {
        url: photoUrl,
        alt: `${name} — ${role}`,
      },
    ];
  }

  return {
    title,
    description,
    openGraph,
    twitter: {
      card: photoUrl ? "summary_large_image" : "summary",
      title,
      description,
      ...(photoUrl ? { images: [photoUrl] } : {}),
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  if (!isValidEmployeeSlug(slug)) notFound();

  const employee = await getEmployeeBySlug(slug);
  if (!employee || !employee.is_published) notFound();

  const canonical = canonicalEmployeeSlug(employee.slug);
  if (canonical && slug.toLowerCase() !== canonical) {
    permanentRedirect(getEmployeePublicPath(employee.slug));
  }

  return <EmployeeCardPage employee={employee} />;
}
