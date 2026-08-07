import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import {
  getLiquidInventoryWithSupabase,
  getLiquidMovementsWithSupabase,
  recordLiquidMovementWithSupabase,
  upsertLiquidInventoryItemWithSupabase,
} from "@/repositories/admin-repository";

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ inventory: [], movements: [] });
    }

    const [inventory, movements] = await Promise.all([
      getLiquidInventoryWithSupabase(supabase),
      getLiquidMovementsWithSupabase(supabase),
    ]);

    return NextResponse.json({ inventory, movements });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Error fetching liquid inventory",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      return NextResponse.json({ synced: true, mode: "demo" });
    }

    const { item, movement } = json;
    if (item) {
      await upsertLiquidInventoryItemWithSupabase(supabase, item);
    }
    if (movement) {
      await recordLiquidMovementWithSupabase(supabase, movement);
    }

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
