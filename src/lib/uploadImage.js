/** Shared image upload validation for admin client + API routes */

export const UPLOAD_MAX_BYTES = 20 * 1024 * 1024; // 20 MB

export const UPLOAD_ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const UPLOAD_ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

const MIME_BY_EXT = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

const MAGIC = {
  jpeg: [0xff, 0xd8, 0xff],
  png: [0x89, 0x50, 0x4e, 0x47],
  gif: [0x47, 0x49, 0x46],
  webp: [0x52, 0x49, 0x46, 0x46], // RIFF — WEBP at offset 8
};

export function formatUploadSize(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

export function sanitizeUploadExt(fileName) {
  const ext = (fileName?.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (UPLOAD_ALLOWED_EXT.has(ext)) return ext === "jpeg" ? "jpg" : ext;
  return "jpg";
}

export function resolveUploadContentType(fileName, declaredType) {
  const ext = sanitizeUploadExt(fileName);
  const fromExt = MIME_BY_EXT[ext === "jpg" ? "jpg" : ext];
  const type = (declaredType || "").toLowerCase().split(";")[0].trim();
  if (UPLOAD_ALLOWED_MIME.has(type)) return type === "image/jpg" ? "image/jpeg" : type;
  return fromExt || "image/jpeg";
}

function matchesMagic(bytes, signature) {
  if (!bytes || bytes.length < signature.length) return false;
  return signature.every((b, i) => bytes[i] === b);
}

function isWebp(bytes) {
  if (!bytes || bytes.length < 12) return false;
  if (!matchesMagic(bytes, MAGIC.webp)) return false;
  return (
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  );
}

export function sniffImageKind(bytes) {
  if (matchesMagic(bytes, MAGIC.jpeg)) return "jpeg";
  if (matchesMagic(bytes, MAGIC.png)) return "png";
  if (matchesMagic(bytes, MAGIC.gif)) return "gif";
  if (isWebp(bytes)) return "webp";
  return null;
}

export function validateUploadFileMeta({ fileName, fileSize, contentType, bytes }) {
  if (!fileName || typeof fileName !== "string") {
    return { ok: false, error: "invalid_file", message: "File name is missing." };
  }

  if (typeof fileSize !== "number" || !Number.isFinite(fileSize) || fileSize <= 0) {
    return { ok: false, error: "invalid_file", message: "File is empty or unreadable." };
  }

  if (fileSize > UPLOAD_MAX_BYTES) {
    return {
      ok: false,
      error: "file_too_large",
      message: `Image is too large (${formatUploadSize(fileSize)}). Max ${formatUploadSize(UPLOAD_MAX_BYTES)}.`,
    };
  }

  const ext = sanitizeUploadExt(fileName);
  const type = (contentType || "").toLowerCase().split(";")[0].trim();

  if (type === "image/heic" || type === "image/heif" || ext === "heic" || ext === "heif") {
    return {
      ok: false,
      error: "unsupported_format",
      message: "HEIC/HEIF is not supported. Export as JPG or PNG and try again.",
    };
  }

  if (bytes && bytes.length > 0) {
    const kind = sniffImageKind(bytes);
    if (!kind) {
      return {
        ok: false,
        error: "unsupported_format",
        message: "File does not look like a valid JPG, PNG, WebP, or GIF image.",
      };
    }
  } else if (type && !UPLOAD_ALLOWED_MIME.has(type)) {
    return {
      ok: false,
      error: "unsupported_format",
      message: "Use JPG, PNG, WebP, or GIF.",
    };
  }

  return {
    ok: true,
    ext,
    contentType: resolveUploadContentType(fileName, contentType),
  };
}

export function validateBrowserFile(file) {
  if (!file) {
    return { ok: false, error: "missing_file", message: "Choose a file to upload." };
  }
  return validateUploadFileMeta({
    fileName: file.name,
    fileSize: file.size,
    contentType: file.type,
  });
}

export function buildDesignObjectPath(slug, kind, ext) {
  const safeExt = sanitizeUploadExt(`x.${ext}`);
  return `designs/${slug}/${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
}

export function storagePathFromPublicUrl(url, bucket) {
  if (!url || typeof url !== "string") return null;
  try {
    const parsed = new URL(url);
    const marker = `/storage/v1/object/public/${bucket}/`;
    const idx = parsed.pathname.indexOf(marker);
    if (idx === -1) return null;
    return decodeURIComponent(parsed.pathname.slice(idx + marker.length));
  } catch {
    return null;
  }
}
