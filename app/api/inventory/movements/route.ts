import { NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth-server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { insertInventoryMovementWithSupabase } from "@/repositories/admin-repository";
import { inventoryMovementSyncSchema } from "@/schemas/inventory";

export async function POST(request: Request) {
  const auth = await requireApiAuth(request, ["admin"]);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const json = await request.json();
    const movement = inventoryMovementSyncSchema.parse(json);
    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      return NextResponse.json({ synced: true, mode: "demo" });
    }

    await insertInventoryMovementWithSupabase(supabase, movement);
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
