/**
 * Build QuoteIQ iframe src with optional YardCraft attribution query params.
 * Only non-empty values are appended so we never send blank keys that could
 * confuse downstream parsers.
 */
export function getQuoteIqEmbedUrl(baseUrl, { slug, pageUrl, timestamp } = {}) {
  const trimmed = typeof baseUrl === "string" ? baseUrl.trim() : "";
  if (!trimmed) return "";

  let url;
  try {
    url = new URL(trimmed);
  } catch {
    return trimmed;
  }

  if (slug) {
    url.searchParams.set("yc_source_property", slug);
    url.searchParams.set("yc_source_slug", slug);
    url.searchParams.set("utm_content", slug);
  }

  if (pageUrl) url.searchParams.set("yc_source_url", pageUrl);
  if (timestamp) url.searchParams.set("yc_source_ts", timestamp);

  url.searchParams.set("utm_source", "yardcraft");
  url.searchParams.set("utm_medium", "embed");
  url.searchParams.set("utm_campaign", "property");

  return url.toString();
}

export function getQuoteIqConfiguredBaseUrl() {
  return process.env.NEXT_PUBLIC_QUOTEIQ_EMBED_URL?.trim() || "";
}
