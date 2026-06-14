import { readFile } from "fs/promises";
import path from "path";

import { getSiteUrl } from "@/lib/site";

const EXTENSION_TO_VCARD_TYPE = {
  png: "PNG",
  jpg: "JPEG",
  jpeg: "JPEG",
  gif: "GIF",
};

const VCARD_PHOTO_SIZE = 256;
const VCARD_JPEG_QUALITY = 82;

function resolveAssetOrigin(origin) {
  const fromRequest = String(origin || "").trim().replace(/\/$/, "");
  if (fromRequest) return fromRequest;

  const fromEnv = getSiteUrl();
  if (fromEnv && !fromEnv.includes("localhost")) return fromEnv;

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "")}`;

  return fromEnv || "";
}

function vcardTypeFromPath(filePath) {
  const ext = path.extname(filePath).slice(1).toLowerCase();
  return EXTENSION_TO_VCARD_TYPE[ext] || null;
}

function publicFilePathFromUrl(photoUrl) {
  const trimmed = String(photoUrl || "").trim();
  if (!trimmed.startsWith("/")) return null;

  const relative = trimmed.replace(/^\/+/, "");
  const publicRoot = path.resolve(path.join(process.cwd(), "public"));
  const filePath = path.resolve(path.join(publicRoot, relative));

  if (!filePath.startsWith(`${publicRoot}${path.sep}`) && filePath !== publicRoot) {
    return null;
  }

  return filePath;
}

function toAbsolutePhotoUrl(photoUrl, origin) {
  const trimmed = String(photoUrl || "").trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const base = resolveAssetOrigin(origin);
  if (trimmed.startsWith("/") && base) return `${base}${trimmed}`;

  return null;
}

async function prepareVCardPhoto(buffer) {
  if (!buffer?.length) return null;

  try {
    const sharp = (await import("sharp")).default;
    const jpegBuffer = await sharp(buffer)
      .rotate()
      .resize(VCARD_PHOTO_SIZE, VCARD_PHOTO_SIZE, { fit: "cover" })
      .jpeg({ quality: VCARD_JPEG_QUALITY, mozjpeg: true })
      .toBuffer();

    if (!jpegBuffer.length) return null;
    return { type: "JPEG", base64: jpegBuffer.toString("base64") };
  } catch {
    return null;
  }
}

function bufferToVCardPhoto(buffer, filePathOrUrl) {
  if (!buffer?.length) return null;

  const type = vcardTypeFromPath(filePathOrUrl) || "JPEG";
  return { type, base64: buffer.toString("base64") };
}

async function loadPhotoFromFile(filePath) {
  try {
    const buffer = await readFile(filePath);
    const prepared = await prepareVCardPhoto(buffer);
    if (prepared?.base64) return prepared;

    return bufferToVCardPhoto(buffer, filePath);
  } catch {
    return null;
  }
}

async function loadPhotoFromAbsoluteUrl(absoluteUrl) {
  try {
    const response = await fetch(absoluteUrl, { cache: "force-cache" });
    if (!response.ok) return null;

    const buffer = Buffer.from(await response.arrayBuffer());
    const prepared = await prepareVCardPhoto(buffer);
    if (prepared?.base64) return prepared;

    const typeFromPath = vcardTypeFromPath(new URL(absoluteUrl).pathname);
    if (typeFromPath) {
      return bufferToVCardPhoto(buffer, absoluteUrl);
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("jpeg") || contentType.includes("jpg")) {
      return { type: "JPEG", base64: buffer.toString("base64") };
    }
    if (contentType.includes("png")) {
      return { type: "PNG", base64: buffer.toString("base64") };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Load employee avatar as embedded base64 for vCard PHOTO.
 * Never returns a URL-only photo — URI references display as text on Android.
 */
export async function loadEmployeeVCardPhoto(photoUrl, { origin } = {}) {
  const trimmed = String(photoUrl || "").trim();
  if (!trimmed) return null;

  const localPath = publicFilePathFromUrl(trimmed);
  if (localPath) {
    const localPhoto = await loadPhotoFromFile(localPath);
    if (localPhoto?.base64) return localPhoto;
  }

  const absoluteUrl = toAbsolutePhotoUrl(trimmed, origin);
  if (absoluteUrl) {
    const remotePhoto = await loadPhotoFromAbsoluteUrl(absoluteUrl);
    if (remotePhoto?.base64) return remotePhoto;
  }

  return null;
}
