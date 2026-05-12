import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { insertPurchaseWithSupabase } from "@/repositories/admin-repository";
import { purchaseSyncSchema } from "@/schemas/inventory";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const purchase = purchaseSyncSchema.parse(json);
    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      return NextResponse.json({ synced: true, mode: "demo" });
    }

    await insertPurchaseWithSupabase(supabase, purchase);
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
