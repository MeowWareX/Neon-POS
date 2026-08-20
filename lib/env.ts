import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("NEON OS"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  GOOGLE_WALLET_ISSUER_ID: z.string().optional(),
  GOOGLE_WALLET_CLASS_ID: z.string().default("neon_loyalty_v1"),
  GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL: z.string().optional(),
  GOOGLE_WALLET_PRIVATE_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_SUPABASE_URL:
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_SERVICE_ROLE_KEY:
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY,
  GOOGLE_WALLET_ISSUER_ID:
    process.env.GOOGLE_WALLET_ISSUER_ID,
  GOOGLE_WALLET_CLASS_ID:
    process.env.GOOGLE_WALLET_CLASS_ID || "neon_loyalty_v1",
  GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL:
    process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_WALLET_PRIVATE_KEY: process.env.GOOGLE_WALLET_PRIVATE_KEY,
});

if (!parsed.success) {
  console.warn(
    "Environment parsing warning:",
    parsed.error.flatten().fieldErrors,
  );
}

export const env = parsed.success
  ? parsed.data
  : {
      NEXT_PUBLIC_APP_NAME: "NEON OS",
      NEXT_PUBLIC_SUPABASE_URL: undefined,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: undefined,
      SUPABASE_SERVICE_ROLE_KEY: undefined,
      GOOGLE_WALLET_ISSUER_ID: undefined,
      GOOGLE_WALLET_CLASS_ID: "neon_loyalty_v1",
      GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL: undefined,
      GOOGLE_WALLET_PRIVATE_KEY: undefined,
    };

export const isSupabaseConfigured = Boolean(
  env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export const hasServiceRole = Boolean(
  isSupabaseConfigured && env.SUPABASE_SERVICE_ROLE_KEY,
);

export const isGoogleWalletConfigured = Boolean(
  env.GOOGLE_WALLET_ISSUER_ID &&
    env.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL &&
    env.GOOGLE_WALLET_PRIVATE_KEY,
);
