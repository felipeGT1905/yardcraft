/** Property slugs: dmv0001, dmv0002 — legacy design1/design28 still resolve for migration */

export const DESIGN_SLUG_PREFIX = "dmv";
export const DESIGN_SLUG_PAD = 4;
const LEGACY_PREFIX = "design";

const DMV_SLUG_RE = /^dmv\d+$/i;
const LEGACY_SLUG_RE = /^design\d+$/i;

export function getDesignNumber(slug) {
  const s = typeof slug === "string" ? slug.trim().toLowerCase() : "";
  if (!s) return null;

  if (DMV_SLUG_RE.test(s)) {
    const n = Number.parseInt(s.slice(DESIGN_SLUG_PREFIX.length), 10);
    return Number.isFinite(n) && n >= 1 ? n : null;
  }

  if (LEGACY_SLUG_RE.test(s)) {
    const n = Number.parseInt(s.slice(LEGACY_PREFIX.length), 10);
    return Number.isFinite(n) && n >= 1 ? n : null;
  }

  return null;
}

/** Display label: "1", "2", "3" — never the full slug string */
export function formatDesignNumber(slug) {
  const n = getDesignNumber(slug);
  return n != null ? String(n) : "—";
}

export function isValidDesignSlug(slug) {
  return getDesignNumber(slug) != null;
}

/** Canonical DB/public slug: dmv0001, dmv0028 */
export function canonicalDesignSlug(slug) {
  const n = getDesignNumber(slug);
  if (n == null || n < 1) return null;
  return `${DESIGN_SLUG_PREFIX}${String(n).padStart(DESIGN_SLUG_PAD, "0")}`;
}

/** Public URL path for a property (e.g. /dmv0001) */
export function getDesignPublicPath(slug) {
  const canonical = canonicalDesignSlug(slug);
  return canonical ? `/${canonical}` : "";
}

/** Accepts dmv0001, design28, bare number "28" or "0001" */
export function resolveDesignSlug(input) {
  const s = typeof input === "string" ? input.trim() : "";
  if (!s) return null;
  if (/^\d+$/.test(s)) return canonicalDesignSlug(s);
  return canonicalDesignSlug(s);
}

/** Next sequential slug (e.g. dmv0027 → dmv0028) */
export function getNextDesignSlug(designs) {
  const slugs = (Array.isArray(designs) ? designs : [])
    .map((d) => (typeof d === "string" ? d : d?.slug))
    .filter(Boolean);

  let maxNum = 0;
  for (const slug of slugs) {
    const n = getDesignNumber(slug);
    if (n != null && n > maxNum) maxNum = n;
  }

  return `${DESIGN_SLUG_PREFIX}${String(maxNum + 1).padStart(DESIGN_SLUG_PAD, "0")}`;
}

function designScore(d) {
  return (d?.before_image ? 1 : 0) + (d?.after_image ? 1 : 0);
}

function designTimestamp(d) {
  const raw = d?.updated_at || d?.created_at;
  if (!raw) return 0;
  const ms = new Date(raw).getTime();
  return Number.isNaN(ms) ? 0 : ms;
}

function pickPreferredDesign(a, b) {
  const sa = designScore(a);
  const sb = designScore(b);
  if (sa !== sb) return sa > sb ? a : b;
  return designTimestamp(a) >= designTimestamp(b) ? a : b;
}

/** Collapse legacy slugs (design009, dmv0009) to one row per property number. */
export function dedupeDesignsByNumber(designs) {
  const byNum = new Map();
  for (const d of designs) {
    const num = getDesignNumber(d?.slug);
    if (num == null) continue;
    const existing = byNum.get(num);
    byNum.set(num, existing ? pickPreferredDesign(existing, d) : d);
  }
  return Array.from(byNum.values());
}

export function assertValidDesignSlug(slug) {
  const canonical = canonicalDesignSlug(slug);
  if (!canonical) {
    throw new Error(
      "Slug must be a numeric property id (e.g. dmv0001). Text names are not allowed.",
    );
  }
  return canonical;
}
