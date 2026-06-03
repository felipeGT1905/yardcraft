/** Normalize stored image URLs for `<img src>` (trim, protocol-relative → https). */
export function normalizeDesignImageUrl(url) {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("//") ? `https:${trimmed}` : trimmed;
}

/**
 * Resolve before/after URLs for the public comparison slider.
 * Never copies after → before (avoids a fake two-sided comparison).
 */
export function resolveDesignComparisonUrls(before, after) {
  const beforeUrl = normalizeDesignImageUrl(before);
  const afterUrl = normalizeDesignImageUrl(after);

  if (beforeUrl && afterUrl) {
    return { beforeUrl, afterUrl, canCompare: true, hasImages: true };
  }
  if (beforeUrl) {
    return { beforeUrl, afterUrl: "", canCompare: false, hasImages: true };
  }
  if (afterUrl) {
    return { beforeUrl: "", afterUrl, canCompare: false, hasImages: true };
  }

  return {
    beforeUrl: "",
    afterUrl: "",
    canCompare: false,
    hasImages: false,
  };
}
