import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { CashSession } from "@/types/domain";

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      return NextResponse.json({ sessions: [], mode: "demo" });
    }

    const { data, error } = await supabase
      .from("cash_sessions")
      .select("*")
      .order("opened_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    // Transform database format to domain format
    const sessions: CashSession[] = (data || []).map((row: Record<string, unknown>) => ({
      id: row.id,
      openingCash: row.opening_cash,
      openedAt: row.opened_at,
      closingCash: row.closing_cash || undefined,
      closedAt: row.closed_at || undefined,
      expectedCash: row.expected_cash || undefined,
      difference: row.difference || undefined,
      status: row.status,
    }));

    return NextResponse.json({ sessions, mode: "supabase" });
  } catch (error) {
    console.error("Failed to fetch cash sessions:", error);
    return NextResponse.json(
      {
        sessions: [],
        mode: "demo",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
