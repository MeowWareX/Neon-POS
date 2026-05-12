import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { openCashSessionWithSupabase } from "@/repositories/admin-repository";
import { openCashSyncSchema } from "@/schemas/cash";

export async function POST(request: Request) {
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
