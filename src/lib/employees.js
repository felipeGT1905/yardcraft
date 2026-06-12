import { assertValidEmployeeSlug, resolveEmployeeSlug } from "@/lib/employeeSlug";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseAdmin";

const TABLE = "employees";
const SELECT =
  "id,slug,display_name,job_title,office_phone,direct_phone,email,location,photo_url,social_links,notes,is_published,created_at,updated_at";

function normalizeSlug(slug) {
  return resolveEmployeeSlug(slug) ?? "";
}

function normalizeSocialLinks(value) {
  if (value == null) return undefined;
  if (typeof value !== "object" || Array.isArray(value)) {
    throw new Error("social_links must be a plain object.");
  }
  return value;
}

function applyEmployeeFields(target, input) {
  if (typeof input?.display_name === "string") target.display_name = input.display_name.trim();
  if (typeof input?.job_title === "string") target.job_title = input.job_title.trim();

  if (typeof input?.office_phone === "string") target.office_phone = input.office_phone.trim();
  else if (input && "office_phone" in input && input.office_phone === null) target.office_phone = null;

  if (typeof input?.direct_phone === "string") target.direct_phone = input.direct_phone.trim();
  else if (input && "direct_phone" in input && input.direct_phone === null) target.direct_phone = null;

  if (typeof input?.email === "string") target.email = input.email.trim();
  else if (input && "email" in input && input.email === null) target.email = null;

  if (typeof input?.location === "string") target.location = input.location.trim();
  else if (input && "location" in input && input.location === null) target.location = null;

  if (typeof input?.photo_url === "string") target.photo_url = input.photo_url.trim();
  else if (input && "photo_url" in input && input.photo_url === null) target.photo_url = null;

  if (typeof input?.notes === "string") target.notes = input.notes.trim();
  else if (input && "notes" in input && input.notes === null) target.notes = null;

  if (typeof input?.is_published === "boolean") target.is_published = input.is_published;

  if (input && "social_links" in input) {
    target.social_links = normalizeSocialLinks(input.social_links);
  }
}

async function listAllEmployeeRows(supabase) {
  const { data, error } = await supabase
    .from(TABLE)
    .select(SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Supabase listEmployees failed: ${error.message}`);
  }

  return data ?? [];
}

export async function listEmployees() {
  if (!isSupabaseConfigured()) return [];

  const supabase = getSupabaseAdmin();
  return listAllEmployeeRows(supabase);
}

export async function getEmployeeBySlug(slug) {
  const s = normalizeSlug(slug);
  if (!s) return null;
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase.from(TABLE).select(SELECT).eq("slug", s).maybeSingle();

  if (error) {
    throw new Error(`Supabase getEmployeeBySlug failed: ${error.message}`);
  }

  return data ?? null;
}

export async function createEmployee(input) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured (missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");
  }

  const slug = assertValidEmployeeSlug(input?.slug);
  const payload = { slug };
  applyEmployeeFields(payload, input);

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase.from(TABLE).insert(payload).select(SELECT).single();

  if (error) {
    throw new Error(`Supabase createEmployee failed: ${error.message}`);
  }

  return data;
}

export async function updateEmployee(slug, patch) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured (missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");
  }

  const s = assertValidEmployeeSlug(slug);
  const updates = {};
  applyEmployeeFields(updates, patch);

  if (Object.keys(updates).length === 0) {
    throw new Error("updateEmployee requires at least one field to update.");
  }

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from(TABLE)
    .update(updates)
    .eq("slug", s)
    .select(SELECT)
    .maybeSingle();

  if (error) {
    throw new Error(`Supabase updateEmployee failed: ${error.message}`);
  }

  return data ?? null;
}
