/**
 * Build QuoteIQ iframe src.
 *
 * Important: QuoteIQ form submissions have been observed to fail when extra
 * query params are appended for certain embedded contexts. So we intentionally
 * return the base URL exactly as configured.
 */
export function getQuoteIqEmbedUrl(baseUrl, { slug, pageUrl, timestamp } = {}) {
  const trimmed = typeof baseUrl === "string" ? baseUrl.trim() : "";
  if (!trimmed) return "";

  void slug;
  void pageUrl;
  void timestamp;
  return trimmed;
}

export function getQuoteIqConfiguredBaseUrl() {
  return process.env.NEXT_PUBLIC_QUOTEIQ_EMBED_URL?.trim() || "";
}
