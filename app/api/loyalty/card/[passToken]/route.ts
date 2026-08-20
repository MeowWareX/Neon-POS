import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { getLoyaltyCardByToken } from "@/repositories/loyalty-repository";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ passToken: string }> },
) {
  const { passToken } = await params;

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 503 },
    );
  }

  const result = await getLoyaltyCardByToken(supabase, passToken);
  if (!result) {
    return NextResponse.json({ error: "Pass not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}
