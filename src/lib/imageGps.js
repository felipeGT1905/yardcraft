import exifr from "exifr";

/** @param {number} latitude */
/** @param {number} longitude */
export function formatGpsCoordinates(latitude, longitude) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  const latDir = latitude >= 0 ? "N" : "S";
  const lonDir = longitude >= 0 ? "E" : "W";
  return `${Math.abs(latitude).toFixed(4)}° ${latDir}, ${Math.abs(longitude).toFixed(4)}° ${lonDir}`;
}

/**
 * Read GPS coordinates from an image URL (JPEG/PNG/WebP with EXIF).
 * @returns {Promise<{ found: boolean, label?: string, latitude?: number, longitude?: number }>}
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
    return {
      found: true,
      label: label || undefined,
      latitude,
      longitude,
    };
  } catch {
    return { found: false };
  }
}
