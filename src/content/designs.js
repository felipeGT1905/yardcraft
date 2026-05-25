export const designs = [
  {
    slug: "midnight-gild",
    name: "Midnight Gild",
    description: "Dark editorial layout with gold accents and bold spacing.",
    tags: ["landing", "luxury", "dark"],
  },
  {
    slug: "ivory-gallery",
    name: "Ivory Gallery",
    description: "Minimal product story layout with image-first sections.",
    tags: ["minimal", "gallery", "brand"],
  },
  {
    slug: "concierge-suite",
    name: "Concierge Suite",
    description: "Service-focused layout with premium CTAs and testimonials.",
    tags: ["services", "cta", "premium"],
  },
];

export function getDesignBySlug(slug) {
  return designs.find((d) => d.slug === slug) ?? null;
}

