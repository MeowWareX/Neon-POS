import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { closeCashSessionWithSupabase } from "@/repositories/admin-repository";
import { closeCashSyncSchema } from "@/schemas/cash";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const session = closeCashSyncSchema.parse(json);
    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      return NextResponse.json({ synced: true, mode: "demo" });
    }

    await closeCashSessionWithSupabase(supabase, {
      id: session.id,
      openingCash: 0,
      status: session.status,
      openedAt: session.closedAt,
      closedAt: session.closedAt,
      closingCash: session.closingCash,
      expectedCash: session.expectedCash,
      difference: session.difference,
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
