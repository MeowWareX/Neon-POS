import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env, isSupabaseConfigured } from "@/lib/env";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { AppUser } from "@/types/domain";

export interface AuthSuccess {
  ok: true;
  user: AppUser;
  response?: never;
}

export interface AuthFailure {
  ok: false;
  user?: never;
  response: NextResponse;
}

export type AuthResult = AuthSuccess | AuthFailure;

/**
 * Validates the caller's session and role.
 * - In demo mode (when Supabase is not configured), allows access as demo admin.
 * - In production, verifies session cookies via @supabase/ssr or Bearer JWT token.
 * - Checks that the user exists in public.users and has one of the allowed roles.
 */
export async function requireApiAuth(
  request: Request,
  allowedRoles: Array<"admin" | "operator"> = ["admin", "operator"],
): Promise<AuthResult> {
  // If Supabase is not configured (local demo mode without cloud database)
  if (!isSupabaseConfigured) {
    return {
      ok: true,
      user: {
        id: "user-admin",
        email: "admin@neon.local",
        name: "Admin Demo",
        role: "admin",
      },
    };
  }

  try {
    let authUser: {
      id: string;
      email?: string;
      user_metadata?: Record<string, unknown>;
    } | null = null;

    // 1. Check cookies using @supabase/ssr
    const cookieStore = await cookies();
    const supabase = createServerClient<Database>(
      env.NEXT_PUBLIC_SUPABASE_URL!,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options),
              );
            } catch {
              // Ignore in read-only / GET context
            }
          },
        },
      },
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!userError && user) {
      authUser = user;
    }

    // 2. Fallback to Authorization: Bearer <token> if cookie was not present
    if (!authUser) {
      const authHeader = request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.substring(7).trim();
        const {
          data: { user: jwtUser },
          error: jwtError,
        } = await supabase.auth.getUser(token);
        if (!jwtError && jwtUser) {
          authUser = jwtUser;
        }
      }
    }

    if (!authUser) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: "No autorizado. Inicie sesión en NEON OS." },
          { status: 401 },
        ),
      };
    }

    // 3. Resolve user profile and role from the database
    const admin = getSupabaseAdminClient();
    const clientForProfile = admin ?? supabase;

    const email = authUser.email?.toLowerCase() ?? "";
    const { data: profile } = await clientForProfile
      .from("users")
      .select("id, full_name, role, email")
      .or(`auth_user_id.eq.${authUser.id},email.eq.${email}`)
      .maybeSingle();

    const role: AppUser["role"] =
      profile?.role === "admin" || profile?.role === "operator"
        ? (profile.role as AppUser["role"])
        : "operator";

    if (!allowedRoles.includes(role)) {
      return {
        ok: false,
        response: NextResponse.json(
          {
            error:
              "Acceso denegado. Se requieren permisos de administrador.",
          },
          { status: 403 },
        ),
      };
    }

    const appUser: AppUser = {
      id: profile?.id ?? authUser.id,
      email,
      name:
        profile?.full_name ??
        (authUser.user_metadata?.full_name as string | undefined) ??
        authUser.email?.split("@")[0] ??
        "Usuario",
      role,
    };

    return {
      ok: true,
      user: appUser,
    };
  } catch (error) {
    console.error("Error en verificación de autenticación:", error);
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Error interno de autenticación." },
        { status: 500 },
      ),
    };
  }
}
