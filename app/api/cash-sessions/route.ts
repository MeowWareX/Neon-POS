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
    const sessions: CashSession[] = (data || []).map(
      (row: Record<string, unknown>) => ({
        id: String(row.id),
        openingCash: Number(row.opening_cash) || 0,
        openedAt: String(row.opened_at),
        closingCash: row.closing_cash ? Number(row.closing_cash) : undefined,
        closedAt: row.closed_at ? String(row.closed_at) : undefined,
        expectedCash: row.expected_cash ? Number(row.expected_cash) : undefined,
        difference: row.difference ? Number(row.difference) : undefined,
        status: String(row.status) as "open" | "closed",
      }),
    );

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
