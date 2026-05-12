import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { insertOrderWithSupabase } from "@/repositories/order-repository";
import { orderSyncSchema } from "@/schemas/order";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const order = orderSyncSchema.parse(json);
    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      return NextResponse.json({ synced: true, mode: "demo" });
    }

    await insertOrderWithSupabase(supabase, order);

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
