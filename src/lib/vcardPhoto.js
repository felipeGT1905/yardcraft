import { readFile } from "fs/promises";
import path from "path";

import { getSiteUrl } from "@/lib/site";

const EXTENSION_TO_VCARD_TYPE = {
  png: "PNG",
  jpg: "JPEG",
  jpeg: "JPEG",
  gif: "GIF",
};

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

function toAbsolutePhotoUrl(photoUrl) {
  const trimmed = String(photoUrl || "").trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return `${getSiteUrl()}${trimmed}`;
  return null;
}

async function loadPhotoFromFile(filePath) {
  const type = vcardTypeFromPath(filePath);
  if (!type) return null;

  try {
    const buffer = await readFile(filePath);
    if (!buffer.length) return null;
    return { type, base64: buffer.toString("base64") };
  } catch {
    return null;
  }
}

async function loadPhotoFromUrl(photoUrl) {
  const absoluteUrl = toAbsolutePhotoUrl(photoUrl);
  if (!absoluteUrl) return null;

  try {
    const response = await fetch(absoluteUrl);
    if (!response.ok) return null;

    const buffer = Buffer.from(await response.arrayBuffer());
    if (!buffer.length) return null;

    let type = vcardTypeFromPath(new URL(absoluteUrl).pathname);
    if (!type) {
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("jpeg") || contentType.includes("jpg")) type = "JPEG";
      else if (contentType.includes("png")) type = "PNG";
      else if (contentType.includes("gif")) type = "GIF";
    }

    if (!type) return null;
    return { type, base64: buffer.toString("base64") };
  } catch {
    return null;
  }
}

/** Load employee avatar bytes for embedding in a vCard PHOTO field. */
export async function loadEmployeeVCardPhoto(photoUrl) {
  const trimmed = String(photoUrl || "").trim();
  if (!trimmed) return null;

  const localPath = publicFilePathFromUrl(trimmed);
  if (localPath) {
    const localPhoto = await loadPhotoFromFile(localPath);
    if (localPhoto) return localPhoto;
  }

  return loadPhotoFromUrl(trimmed);
}
