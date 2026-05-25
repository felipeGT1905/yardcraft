/** Fixed locale so SSR and client hydration always match (Node vs browser defaults differ). */
const DISPLAY_LOCALE = "en-US";

const DATE_OPTIONS = { year: "numeric", month: "numeric", day: "numeric" };

const DATE_TIME_OPTIONS = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
};

function parseIso(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** e.g. 5/25/2026 */
export function formatDisplayDate(iso) {
  const d = parseIso(iso);
  if (!d) return "";
  return d.toLocaleDateString(DISPLAY_LOCALE, DATE_OPTIONS);
}

/** e.g. 5/25/2026, 3:45 PM */
export function formatDisplayDateTime(iso) {
  const d = parseIso(iso);
  if (!d) return "";
  return d.toLocaleString(DISPLAY_LOCALE, DATE_TIME_OPTIONS);
}

/** e.g. May 25, 2026 */
export function formatDisplayDateLong(iso) {
  const d = parseIso(iso);
  if (!d) return null;
  return d.toLocaleDateString(DISPLAY_LOCALE, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
