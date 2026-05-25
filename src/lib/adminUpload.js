import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { resolveDesignSlug } from "@/lib/designSlug";
import { upsertDesign } from "@/lib/designs";
import {
  buildDesignObjectPath,
  storagePathFromPublicUrl,
  validateUploadFileMeta,
} from "@/lib/uploadImage";

export function getStorageBucket() {
  return (process.env.SUPABASE_STORAGE_BUCKET || "design-images").trim();
}

export function parseUploadKind(value) {
  return value === "before" || value === "after" ? value : null;
}

export function parseUploadSlug(value) {
  return resolveDesignSlug(typeof value === "string" ? value : "");
}

export async function initDesignUpload({
  slug,
  kind,
  fileName,
  fileSize,
  contentType,
}) {
  const validation = validateUploadFileMeta({ fileName, fileSize, contentType });
  if (!validation.ok) return validation;

  const bucket = getStorageBucket();
  const supabase = getSupabaseAdmin();
  const objectPath = buildDesignObjectPath(slug, kind, validation.ext);

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(objectPath, { upsert: true });

  if (error || !data?.signedUrl) {
    return {
      ok: false,
      error: "signed_url_failed",
      message: error?.message || "Could not prepare upload.",
    };
  }

  return {
    ok: true,
    bucket,
    path: objectPath,
    signedUrl: data.signedUrl,
    token: data.token,
    contentType: validation.contentType,
  };
}

export async function finalizeDesignUpload({
  slug,
  kind,
  path,
  userId,
  previousUrl,
}) {
  const bucket = getStorageBucket();
  const supabase = getSupabaseAdmin();

  const folderPrefix = `designs/${slug}/`;
  if (!path.startsWith(folderPrefix)) {
    return {
      ok: false,
      error: "invalid_path",
      message: "Upload path does not match the selected property.",
    };
  }

  const { error: verifyError } = await supabase.storage.from(bucket).download(path);

  if (verifyError) {
    return {
      ok: false,
      error: "upload_missing",
      message: "Upload did not finish. Please try again.",
    };
  }

  const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(path);
  const url = publicData?.publicUrl || null;
  if (!url) {
    return {
      ok: false,
      error: "public_url_failed",
      message: "Uploaded file could not be published.",
    };
  }

  const design = await upsertDesign(
    kind === "before" ? { slug, before_image: url } : { slug, after_image: url },
    { userId },
  );

  const oldPath = storagePathFromPublicUrl(previousUrl, bucket);
  if (oldPath && oldPath !== path) {
    await supabase.storage.from(bucket).remove([oldPath]).catch(() => {});
  }

  return { ok: true, bucket, path, url, design };
}

export async function uploadDesignFileBuffer({
  slug,
  kind,
  fileName,
  fileSize,
  contentType,
  bytes,
  userId,
  previousUrl,
}) {
  const validation = validateUploadFileMeta({
    fileName,
    fileSize,
    contentType,
    bytes,
  });
  if (!validation.ok) return validation;

  const bucket = getStorageBucket();
  const supabase = getSupabaseAdmin();
  const objectPath = buildDesignObjectPath(slug, kind, validation.ext);

  const { error: uploadError } = await supabase.storage.from(bucket).upload(objectPath, bytes, {
    contentType: validation.contentType,
    upsert: true,
  });

  if (uploadError) {
    return {
      ok: false,
      error: "upload_failed",
      message: uploadError.message || "Storage upload failed.",
    };
  }

  return finalizeDesignUpload({
    slug,
    kind,
    path: objectPath,
    userId,
    previousUrl,
  });
}
