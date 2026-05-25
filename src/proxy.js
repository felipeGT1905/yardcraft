import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

function requiredEnv(name) {
  const value = process.env[name];
  if (!value || typeof value !== "string" || !value.trim()) return null;
  return value.trim();
}

function createSupabaseProxyClient(request, response) {
  const url = requiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = requiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!url || !anonKey) return null;

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  const isLogin = pathname === "/admin/login";

  if (!isAdminPage && !isAdminApi) return NextResponse.next();
  if (isLogin) return NextResponse.next();

  const response = NextResponse.next();
  const supabase = createSupabaseProxyClient(request, response);
  if (!supabase) return response;

  const { data: userData } = await supabase.auth.getUser().catch(() => ({ data: null }));
  const user = userData?.user ?? null;

  if (!user) {
    if (isAdminApi) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  let profile = null;
  try {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    profile = data ?? null;
  } catch {
    profile = null;
  }

  if (profile?.role !== "admin") {
    if (isAdminApi) {
      return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

