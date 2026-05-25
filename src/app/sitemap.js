import { getSiteUrl } from "@/lib/site";
import { designs } from "@/content/designs";

export default function sitemap() {
  const url = getSiteUrl();
  const now = new Date();

  return [
    { url: `${url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${url}/design`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${url}/admin`, lastModified: now, changeFrequency: "monthly", priority: 0.2 },
    ...designs.map((d) => ({
      url: `${url}/design/${d.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    })),
  ];
}

