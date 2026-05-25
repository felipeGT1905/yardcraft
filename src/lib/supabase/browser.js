import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient() {
  // IMPORTANT: In client bundles, Next only inlines NEXT_PUBLIC_* env vars when they
  // are accessed via static property access (not `process.env[name]`).
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url) throw new Error("Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL");
  if (!anonKey)
    throw new Error("Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return createBrowserClient(url, anonKey);
}

