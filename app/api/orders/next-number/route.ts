import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { getLatestOrderSequence } from "@/repositories/order-repository";

/**
 * Get the next order number sequence
 * Returns the next sequence to use for creating a new order
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json(
      { message: "Database not configured" },
      { status: 503 }
    );
  }

  try {
    const sequence = await getLatestOrderSequence(supabase);

    return NextResponse.json({ sequence });
  } catch (error) {
    console.error("Error getting next order number:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Error getting next order number" },
      { status: 500 }
    );
  }
}
