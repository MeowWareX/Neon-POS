import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { insertExpenseWithSupabase } from "@/repositories/admin-repository";
import { expenseSyncSchema } from "@/schemas/accounting";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const expense = expenseSyncSchema.parse(json);
    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      return NextResponse.json({ synced: true, mode: "demo" });
    }

    await insertExpenseWithSupabase(supabase, expense);
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
