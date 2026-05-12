"use client";

import { DEMO_PASSWORD } from "@/lib/constants";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { AppUser } from "@/types/domain";

export async function loginUser(
  email: string,
  password: string,
): Promise<AppUser> {
  const supabase = getSupabaseBrowserClient();

  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      id: data.user.id,
      email: data.user.email ?? email,
      name:
        data.user.user_metadata.full_name ??
        data.user.email?.split("@")[0] ??
        "Usuario",
      role: email.includes("admin") ? "admin" : "operator",
    };
  }

  if (password !== DEMO_PASSWORD) {
    throw new Error("Contraseña demo inválida. Usa 123456.");
  }

  return {
    id: email.includes("admin") ? "user-admin" : "user-operator",
    email,
    name: email.includes("admin") ? "Admin Neon" : "Operador Neon",
    role: email.includes("admin") ? "admin" : "operator",
  };
}
