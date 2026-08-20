import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { loyaltyStampSchema } from "@/schemas/loyalty";
import { addStampsToCustomer } from "@/repositories/loyalty-repository";

export async function POST(request: NextRequest) {
  const json = await request.json();
  const body = loyaltyStampSchema.parse(json);

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  try {
    const result = await addStampsToCustomer(supabase, body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}