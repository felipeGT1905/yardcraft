import { getSiteUrl } from "@/lib/site";
import { getDesignPublicPath } from "@/lib/designSlug";
import { listDesigns } from "@/lib/designs";

export default async function sitemap() {
  const url = getSiteUrl();
  const now = new Date();
  const designs = await listDesigns();

  return [
    { url: `${url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${url}/admin`, lastModified: now, changeFrequency: "monthly", priority: 0.2 },
    ...designs.map((d) => ({
      url: `${url}${getDesignPublicPath(d.slug)}`,
      lastModified: d.updated_at ? new Date(d.updated_at) : now,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  ];
}
