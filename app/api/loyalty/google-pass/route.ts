import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { isGoogleWalletConfigured } from "@/lib/env";
import { getLoyaltyCardByToken } from "@/repositories/loyalty-repository";
import { createGoogleWalletLink } from "@/services/google-wallet.service";

const schema = z.object({
  passToken: z.string().min(1),
});

export async function POST(request: NextRequest) {
  if (!isGoogleWalletConfigured) {
    return NextResponse.json(
      { error: "Google Wallet no configurado" },
      { status: 501 },
    );
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 503 },
    );
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "passToken es requerido" },
      { status: 400 },
    );
  }

  const { passToken } = parsed.data;

  const result = await getLoyaltyCardByToken(supabase, passToken);
  if (!result) {
    return NextResponse.json({ error: "Pass not found" }, { status: 404 });
  }

  try {
    const { saveUrl } = await createGoogleWalletLink(
      result.customer,
      result.pass,
    );
    return NextResponse.json({ saveUrl });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create Google Wallet link";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
