/** Employee card slugs: lowercase letters, numbers, hyphens (e.g. javier, felipe-gt) */

export const RESERVED_EMPLOYEE_SLUGS = new Set(["admin", "api", "design", "card", "go"]);

/** Canonical slug: lowercase [a-z0-9] with single hyphens between segments */
const EMPLOYEE_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isReservedEmployeeSlug(slug) {
  const s = typeof slug === "string" ? slug.trim().toLowerCase() : "";
  return s ? RESERVED_EMPLOYEE_SLUGS.has(s) : false;
}

/** Canonical DB/public slug, or null if invalid or reserved */
export function canonicalEmployeeSlug(slug) {
  const s = typeof slug === "string" ? slug.trim().toLowerCase() : "";
  if (!s || !EMPLOYEE_SLUG_RE.test(s)) return null;
  if (RESERVED_EMPLOYEE_SLUGS.has(s)) return null;
  return s;
}

export function isValidEmployeeSlug(slug) {
  return canonicalEmployeeSlug(slug) != null;
}

/** Normalize user input to canonical slug */
export function resolveEmployeeSlug(input) {
  return canonicalEmployeeSlug(input);
}

/** Public URL path for an employee card (e.g. /card/javier) */
export function getEmployeePublicPath(slug) {
  const canonical = canonicalEmployeeSlug(slug);
  return canonical ? `/card/${canonical}` : "";
}

export function assertValidEmployeeSlug(slug) {
  const canonical = canonicalEmployeeSlug(slug);
  if (!canonical) {
    throw new Error(
      "Employee slug must use lowercase letters, numbers, and hyphens (e.g. javier, felipe-gt). Reserved names (admin, api, design, card, go) are not allowed.",
    );
  }
  return canonical;
}
