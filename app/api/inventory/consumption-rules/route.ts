import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { mapInventoryConsumptionRuleRow } from "@/lib/catalog-mappers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      return NextResponse.json([]);
    }

    const { data, error } = await supabase
      .from("inventory_consumption_rules")
      .select()
      .eq("is_active", true);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json((data ?? []).map(mapInventoryConsumptionRuleRow));
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}