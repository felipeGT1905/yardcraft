import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

function requiredEnv(name) {
  const value = process.env[name];
  if (!value || typeof value !== "string" || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

export function createSupabaseServerClient() {
  const url = requiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = requiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  // Next.js v16+ dynamic APIs: cookies() is async.
  // We return a Supabase client bound to the request cookie store.
  // Note: callers must await createSupabaseServerClient().
  const cookieStorePromise = cookies();

  return cookieStorePromise.then((cookieStore) =>
    createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // In Server Components, Next.js does not allow mutating cookies.
          // Supabase may still attempt to write refreshed auth cookies; we must no-op there.
          // In Route Handlers / Server Actions, cookieStore.set is allowed and will succeed.
          for (const { name, value, options } of cookiesToSet) {
            try {
              cookieStore.set(name, value, options);
            } catch {
              // Swallow to avoid crashing render with:
              // "Cookies can only be modified in a Server Action or Route Handler."
              return;
            }
          }
        },
      },
    }),
  );
}

