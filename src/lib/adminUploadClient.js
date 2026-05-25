import { validateBrowserFile } from "@/lib/uploadImage";

const UPLOAD_TIMEOUT_MS = 120_000;
const MAX_ATTEMPTS = 3;
const RETRYABLE = new Set(["network_error", "signed_url_failed", "upload_missing", "unexpected_error"]);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function xhrPutWithProgress(url, file, contentType, onProgress, signal) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.timeout = UPLOAD_TIMEOUT_MS;
    if (contentType) xhr.setRequestHeader("Content-Type", contentType);

    const abort = () => {
      xhr.abort();
      reject(new Error("Upload cancelled"));
    };
    if (signal) {
      if (signal.aborted) return abort();
      signal.addEventListener("abort", abort, { once: true });
    }

    xhr.upload.onprogress = (evt) => {
      if (!evt.lengthComputable) return;
      onProgress?.(Math.round((evt.loaded / evt.total) * 100));
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
        return;
      }
      reject(new Error(`Storage upload failed (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error("Network error while uploading file"));
    xhr.ontimeout = () => reject(new Error("Upload timed out — try a smaller image or check your connection"));
    xhr.onabort = () => reject(new Error("Upload cancelled"));

    xhr.send(file);
  });
}

async function postJson(url, body, signal) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json?.ok) {
    const err = new Error(json?.message || json?.error || "Upload failed");
    err.code = json?.error || "upload_failed";
    err.status = res.status;
    throw err;
  }
  return json;
}

export async function uploadDesignImage({
  slug,
  kind,
  file,
  onProgress,
  signal,
}) {
  const validation = validateBrowserFile(file);
  if (!validation.ok) {
    const err = new Error(validation.message);
    err.code = validation.error;
    throw err;
  }

  let lastError = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      onProgress?.(0);

      const init = await postJson(
        "/api/admin/designs/upload/init",
        {
          slug,
          kind,
          fileName: file.name,
          fileSize: file.size,
          contentType: file.type,
        },
        signal,
      );

      await xhrPutWithProgress(
        init.signedUrl,
        file,
        init.contentType,
        (pct) => onProgress?.(Math.min(95, Math.max(5, pct))),
        signal,
      );

      onProgress?.(98);

      const complete = await postJson(
        "/api/admin/designs/upload/complete",
        { slug, kind, path: init.path },
        signal,
      );

      onProgress?.(100);
      return complete;
    } catch (err) {
      lastError = err;
      const code = err?.code || "upload_failed";
      const retryable =
        RETRYABLE.has(code) ||
        err?.message?.includes("Network") ||
        err?.message?.includes("timed out") ||
        (typeof err?.status === "number" && err.status >= 500);

      if (!retryable || attempt >= MAX_ATTEMPTS || signal?.aborted) break;
      await sleep(400 * attempt);
    }
  }

  throw lastError || new Error("Upload failed");
}

export function previewUrlWithCacheBust(url, cacheKey) {
  if (!url) return "";
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}v=${encodeURIComponent(String(cacheKey || Date.now()))}`;
}
