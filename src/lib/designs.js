import { assertValidDesignSlug, dedupeDesignsByNumber, getDesignNumber, resolveDesignSlug } from "@/lib/designSlug";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseAdmin";

const TABLE = "designs";
const BASE_SELECT = "slug,before_image,after_image,created_at";
const AUDIT_SELECT = "slug,before_image,after_image,created_at,updated_at,updated_by";

function normalizeSlug(slug) {
  return resolveDesignSlug(slug) ?? "";
}

async function listAllDesignRows(supabase) {
  const first = await supabase
    .from(TABLE)
    .select(AUDIT_SELECT)
    .order("created_at", { ascending: false });

  if (!first.error) return first.data ?? [];

  const fallback = await supabase
    .from(TABLE)
    .select(BASE_SELECT)
    .order("created_at", { ascending: false });

  if (fallback.error) {
    throw new Error(`Supabase listDesigns failed: ${fallback.error.message}`);
  }

  return fallback.data ?? [];
}

async function findLegacySlugForNumber(supabase, canonicalSlug) {
  const num = getDesignNumber(canonicalSlug);
  if (num == null) return null;

  const rows = await listAllDesignRows(supabase);
  const match = rows.find(
    (row) => getDesignNumber(row.slug) === num && row.slug !== canonicalSlug,
  );
  return match?.slug ?? null;
}

async function migrateLegacySlugIfNeeded(supabase, canonicalSlug, legacySlug) {
  if (!legacySlug || legacySlug === canonicalSlug) return canonicalSlug;

  const { data: legacyRow, error: readError } = await supabase
    .from(TABLE)
    .select(AUDIT_SELECT)
    .eq("slug", legacySlug)
    .maybeSingle();

  if (readError) {
    throw new Error(`Supabase migrateLegacySlug read failed: ${readError.message}`);
  }
  if (!legacyRow) return canonicalSlug;

  const { error: insertError } = await supabase.from(TABLE).upsert(
    {
      slug: canonicalSlug,
      before_image: legacyRow.before_image,
      after_image: legacyRow.after_image,
      created_at: legacyRow.created_at,
      updated_at: legacyRow.updated_at,
      updated_by: legacyRow.updated_by ?? null,
    },
    { onConflict: "slug" },
  );

  if (insertError) {
    throw new Error(`Supabase migrateLegacySlug upsert failed: ${insertError.message}`);
  }

  const { error: deleteError } = await supabase.from(TABLE).delete().eq("slug", legacySlug);
  if (deleteError) {
    throw new Error(`Supabase migrateLegacySlug delete failed: ${deleteError.message}`);
  }

  return canonicalSlug;
}

async function resolveDbSlug(supabase, inputSlug) {
  const canonical = assertValidDesignSlug(inputSlug);

  const { data: exact, error: exactError } = await supabase
    .from(TABLE)
    .select("slug")
    .eq("slug", canonical)
    .maybeSingle();

  if (exactError) {
    throw new Error(`Supabase resolveDbSlug failed: ${exactError.message}`);
  }
  if (exact?.slug) return canonical;

  const legacySlug = await findLegacySlugForNumber(supabase, canonical);
  if (!legacySlug) return canonical;

  return migrateLegacySlugIfNeeded(supabase, canonical, legacySlug);
}

export async function listDesigns() {
  if (!isSupabaseConfigured()) return [];

  const supabase = getSupabaseAdmin();
  const rows = await listAllDesignRows(supabase);
  return dedupeDesignsByNumber(rows);
}

export async function getDesignBySlug(slug) {
  const s = normalizeSlug(slug);
  if (!s) return null;
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabaseAdmin();
  const resolvedSlug = await resolveDbSlug(supabase, s);

  const first = await supabase
    .from(TABLE)
    .select(AUDIT_SELECT)
    .eq("slug", resolvedSlug)
    .maybeSingle();

  if (!first.error) return first.data ?? null;

  const fallback = await supabase
    .from(TABLE)
    .select(BASE_SELECT)
    .eq("slug", resolvedSlug)
    .maybeSingle();

  if (fallback.error) {
    throw new Error(`Supabase getDesignBySlug failed: ${fallback.error.message}`);
  }

  return fallback.data ?? null;
}

export async function upsertDesign(input, options = {}) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured (missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");
  }

  const supabase = getSupabaseAdmin();
  const slug = await resolveDbSlug(supabase, input?.slug);

  const payload = { slug };
  if (typeof input?.before_image === "string") payload.before_image = input.before_image.trim();
  if (typeof input?.after_image === "string") payload.after_image = input.after_image.trim();
  if (options.userId) payload.updated_by = options.userId;

  const first = await supabase
    .from(TABLE)
    .upsert(payload, { onConflict: "slug" })
    .select(AUDIT_SELECT)
    .single();

  if (!first.error) return first.data;

  const fallbackPayload = { slug };
  if (typeof input?.before_image === "string") fallbackPayload.before_image = input.before_image.trim();
  if (typeof input?.after_image === "string") fallbackPayload.after_image = input.after_image.trim();

  const fallback = await supabase
    .from(TABLE)
    .upsert(fallbackPayload, { onConflict: "slug" })
    .select(BASE_SELECT)
    .single();

  if (fallback.error) throw new Error(`Supabase upsertDesign failed: ${fallback.error.message}`);
  return fallback.data;
}

export async function updateDesignBySlug(slug, patch, options = {}) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured (missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");
  }

  const supabase = getSupabaseAdmin();
  const s = await resolveDbSlug(supabase, slug);

  const updates = {};
  if (typeof patch?.before_image === "string") updates.before_image = patch.before_image.trim();
  else if (patch && "before_image" in patch && patch.before_image === null) updates.before_image = null;

  if (typeof patch?.after_image === "string") updates.after_image = patch.after_image.trim();
  else if (patch && "after_image" in patch && patch.after_image === null) updates.after_image = null;

  if (Object.keys(updates).length === 0) {
    throw new Error("updateDesignBySlug requires before_image and/or after_image");
  }

  if (options.userId) updates.updated_by = options.userId;

  const first = await supabase
    .from(TABLE)
    .update(updates)
    .eq("slug", s)
    .select(AUDIT_SELECT)
    .maybeSingle();

  if (!first.error) return first.data ?? null;

  const fallback = await supabase
    .from(TABLE)
    .update(updates)
    .eq("slug", s)
    .select(BASE_SELECT)
    .maybeSingle();

  if (fallback.error) throw new Error(`Supabase updateDesignBySlug failed: ${fallback.error.message}`);
  return fallback.data ?? null;
}
