/** Marketing placeholder when a design has no uploaded comparison assets yet. */
export const DESIGN_COMPARISON_PLACEHOLDER = "/images/YardCraft Doorhangers.png";

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
export function resolveDesignComparisonUrls(before, after, placeholder = DESIGN_COMPARISON_PLACEHOLDER) {
  const beforeUrl = normalizeDesignImageUrl(before);
  const afterUrl = normalizeDesignImageUrl(after);

  if (beforeUrl && afterUrl) {
    return { beforeUrl, afterUrl, canCompare: true, isPlaceholder: false };
  }
  if (beforeUrl) {
    return { beforeUrl, afterUrl: "", canCompare: false, isPlaceholder: false };
  }
  if (afterUrl) {
    return { beforeUrl: "", afterUrl, canCompare: false, isPlaceholder: false };
  }

  return {
    beforeUrl: "",
    afterUrl: normalizeDesignImageUrl(placeholder) || placeholder,
    canCompare: false,
    isPlaceholder: true,
  };
}
