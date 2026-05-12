import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { syncActiveFlavorWithSupabase } from "@/repositories/admin-repository";
import { activeFlavorSyncSchema } from "@/schemas/flavors";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const input = activeFlavorSyncSchema.parse(json);
    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      return NextResponse.json({ synced: true, mode: "demo" });
    }

    await syncActiveFlavorWithSupabase(supabase, input);
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
