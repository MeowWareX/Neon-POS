import { NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth-server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import {
  getLiquidInventoryWithSupabase,
  getLiquidMovementsWithSupabase,
  recordLiquidMovementWithSupabase,
  upsertLiquidInventoryItemWithSupabase,
} from "@/repositories/admin-repository";

export async function GET(request: Request) {
  const auth = await requireApiAuth(request, ["admin", "operator"]);
  if (!auth.ok) {
    return auth.response;
  }

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
  const auth = await requireApiAuth(request, ["admin", "operator"]);
  if (!auth.ok) {
    return auth.response;
  }

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

