import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { loyaltyRegisterSchema } from "@/schemas/loyalty";
import { registerCustomer } from "@/repositories/loyalty-repository";

export async function POST(request: NextRequest) {
  const json = await request.json();
  const body = loyaltyRegisterSchema.parse(json);

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 503 },
    );
  }

  try {
    const result = await registerCustomer(supabase, body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if ((error as Error).message === "EmailUnregistered") {
      return NextResponse.json(
        { error: "Primero debes registrarte en www.clubneon.co" },
        { status: 403 },
      );
    }
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
