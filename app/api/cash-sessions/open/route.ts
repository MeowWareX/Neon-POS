import { NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth-server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { openCashSessionWithSupabase } from "@/repositories/admin-repository";
import { openCashSyncSchema } from "@/schemas/cash";

export async function POST(request: Request) {
  const auth = await requireApiAuth(request, ["admin", "operator"]);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const json = await request.json();
    const session = openCashSyncSchema.parse(json);
    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      return NextResponse.json({ synced: true, mode: "demo" });
    }

    await openCashSessionWithSupabase(supabase, {
      id: session.id,
      openingCash: session.openingCash,
      openedAt: session.openedAt,
      status: session.status,
    });
    return NextResponse.json({ synced: true, mode: "supabase" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        synced: false,
        message: error instanceof Error ? error.message : "Sync error",
      },
      { status: 400 },
    );
  }
}
