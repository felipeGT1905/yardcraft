/** Property slugs are numeric ids only: design1, design28, design003 — no text names */

export const DESIGN_SLUG_PREFIX = "design";

const NUMERIC_SLUG_RE = /^design\d+$/i;

export function getDesignNumber(slug) {
  const canonical = canonicalDesignSlug(slug);
  if (!canonical) return null;
  return Number.parseInt(canonical.slice(DESIGN_SLUG_PREFIX.length), 10);
}

/** Display label: "1", "2", "3" — never the full slug string */
export function formatDesignNumber(slug) {
  const n = getDesignNumber(slug);
  return n != null ? String(n) : "—";
}

export function isValidDesignSlug(slug) {
  const s = typeof slug === "string" ? slug.trim() : "";
  return NUMERIC_SLUG_RE.test(s);
}

/** Lowercase canonical slug without zero-padding: design9, design28 */
export function canonicalDesignSlug(slug) {
  const s = typeof slug === "string" ? slug.trim().toLowerCase() : "";
  if (!NUMERIC_SLUG_RE.test(s)) return null;
  const n = Number.parseInt(s.slice(DESIGN_SLUG_PREFIX.length), 10);
  if (!Number.isFinite(n) || n < 1) return null;
  return `${DESIGN_SLUG_PREFIX}${n}`;
}

/** Accepts design28 or bare number "28" for URLs / search */
export function resolveDesignSlug(input) {
  const s = typeof input === "string" ? input.trim() : "";
  if (!s) return null;
  if (/^\d+$/.test(s)) return `${DESIGN_SLUG_PREFIX}${s}`;
  return canonicalDesignSlug(s);
}

/** Next sequential slug (e.g. design27 → design28) — always unpadded */
export function getNextDesignSlug(designs) {
  const slugs = (Array.isArray(designs) ? designs : [])
    .map((d) => (typeof d === "string" ? d : d?.slug))
    .filter(Boolean);

  let maxNum = 0;
  for (const slug of slugs) {
    const n = getDesignNumber(slug);
    if (n != null && n > maxNum) maxNum = n;
  }

  return `${DESIGN_SLUG_PREFIX}${maxNum + 1}`;
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

/** Collapse legacy padded slugs (design009) to one row per property number. */
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
      "Slug must be a numeric design id (e.g. design28). Text names are not allowed.",
    );
  }
  return canonical;
}
