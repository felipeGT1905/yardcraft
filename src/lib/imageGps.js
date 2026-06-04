import exifr from "exifr";

const NOMINATIM_USER_AGENT = "YardCraft-Admin/1.0 (property preview; contact: admin@yardcraft.com)";
const NOMINATIM_MIN_INTERVAL_MS = 1100;

/** @type {Promise<unknown>} */
let nominatimChain = Promise.resolve();
let lastNominatimAt = 0;

/** Serialize Nominatim calls (1 req/sec policy). */
function scheduleNominatim(task) {
  const run = nominatimChain.then(async () => {
    const wait = Math.max(0, NOMINATIM_MIN_INTERVAL_MS - (Date.now() - lastNominatimAt));
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
    lastNominatimAt = Date.now();
    return task();
  });
  nominatimChain = run.catch(() => {});
  return run;
}

/** @param {number} latitude */
/** @param {number} longitude */
export function formatGpsCoordinates(latitude, longitude) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  const latDir = latitude >= 0 ? "N" : "S";
  const lonDir = longitude >= 0 ? "E" : "W";
  return `${Math.abs(latitude).toFixed(4)}° ${latDir}, ${Math.abs(longitude).toFixed(4)}° ${lonDir}`;
}

/** @param {Record<string, string | undefined>} address */
function formatNominatimAddress(address, displayName) {
  if (!address || typeof address !== "object") {
    return typeof displayName === "string" ? displayName.trim() || null : null;
  }

  const line1 = [address.house_number, address.road].filter(Boolean).join(" ");
  const locality =
    address.city ||
    address.town ||
    address.village ||
    address.hamlet ||
    address.suburb ||
    address.neighbourhood;
  const region = address.state || address.region;
  const parts = [line1, locality, region, address.postcode].filter(Boolean);

  if (parts.length) return parts.join(", ");
  return typeof displayName === "string" ? displayName.trim() || null : null;
}

/**
 * Reverse-geocode coordinates to a street address (OpenStreetMap Nominatim).
 * @returns {Promise<string | null>}
 */
export async function reverseGeocodeAddress(latitude, longitude) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  return scheduleNominatim(async () => {
    const params = new URLSearchParams({
      lat: String(latitude),
      lon: String(longitude),
      format: "json",
      addressdetails: "1",
      zoom: "18",
    });

    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`, {
      headers: { "User-Agent": NOMINATIM_USER_AGENT, Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json().catch(() => null);
    return formatNominatimAddress(data?.address, data?.display_name);
  });
}

/**
 * Read GPS coordinates from an image URL (JPEG/PNG/WebP with EXIF).
 * @returns {Promise<{ found: boolean, label?: string, address?: string, latitude?: number, longitude?: number }>}
 */
export async function readGpsFromImageUrl(imageUrl) {
  const url = typeof imageUrl === "string" ? imageUrl.trim() : "";
  if (!url) return { found: false };

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return { found: false };

    const bytes = Buffer.from(await res.arrayBuffer());
    const parsed = await exifr.gps(bytes);

    const latitude = parsed?.latitude;
    const longitude = parsed?.longitude;
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return { found: false };
    }

    const label = formatGpsCoordinates(latitude, longitude);
    const address = await reverseGeocodeAddress(latitude, longitude);

    return {
      found: true,
      label: label || undefined,
      address: address || undefined,
      latitude,
      longitude,
    };
  } catch {
    return { found: false };
  }
}
