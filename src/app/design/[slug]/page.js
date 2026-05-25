import { notFound, permanentRedirect } from "next/navigation";

import { getDesignBySlug } from "@/lib/designs";
import { getDesignPublicPath, isValidDesignSlug } from "@/lib/designSlug";

export const dynamic = "force-dynamic";

/** Legacy /design/design1 URLs → /dmv0001 */
export default async function Page({ params }) {
  const { slug } = await params;
  if (!isValidDesignSlug(slug)) notFound();

  const design = await getDesignBySlug(slug);
  if (!design) notFound();

  permanentRedirect(getDesignPublicPath(design.slug));
}
