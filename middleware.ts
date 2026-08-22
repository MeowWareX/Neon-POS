import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

const PUBLIC_PAGE_PREFIXES = [
  "/login",
  "/club",
  "/politica-privacidad",
  "/privacy",
  "/terminos",
  "/terms",
  "/punto-fisico",
  "/manifest.webmanifest",
  "/sw.js",
  "/icons",
  "/logo.jpg",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
];

const PUBLIC_API_PREFIXES = [
  "/api/health",
  "/api/loyalty/register",
  "/api/loyalty/lookup",
  "/api/loyalty/card",
  "/api/loyalty/google-pass",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Root landing page is public
  if (pathname === "/") {
    return NextResponse.next();
  }

  // Allow public static assets and public customer-facing pages
  if (PUBLIC_PAGE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase is not configured (local demo environment), pass through
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Verify auth session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect backend API routes
  if (pathname.startsWith("/api/")) {
    const isPublicApi = PUBLIC_API_PREFIXES.some((prefix) =>
      pathname.startsWith(prefix),
    );

    if (isPublicApi) {
      return supabaseResponse;
    }

    if (!user) {
      // Allow Bearer token in header to pass to Route Handler for validation
      const authHeader = request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        return supabaseResponse;
      }

      return NextResponse.json(
        { error: "No autorizado. Se requiere iniciar sesión en NEON OS." },
        { status: 401 },
      );
    }

    return supabaseResponse;
  }

  // Protect platform pages (POS, Dashboard, Accounting, etc.)
  if (!user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|webmanifest|json)$).*)",
  ],
};
