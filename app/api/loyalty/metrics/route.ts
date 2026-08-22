import { NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth-server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type CustomerRow = Database["public"]["Tables"]["customers"]["Row"];

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const auth = await requireApiAuth(request, ["admin"]);
  if (!auth.ok) {
    return auth.response;
  }

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json(
      { message: "Supabase not configured" },
      { status: 503 },
    );
  }

  try {
    const { count: totalCustomers, error: customersErr } = await supabase
      .from("customers")
      .select("*", { count: "exact", head: true });

    if (customersErr) throw new Error(customersErr.message);

    const { data: customers, error: listErr } = await supabase
      .from("customers")
      .select(
        "id, full_name, phone, email, stamps_count, total_rewards_claimed, created_at, updated_at",
      )
      .order("created_at", { ascending: false })
      .limit(1000);

    if (listErr) throw new Error(listErr.message);

    const { data: logs, error: logsErr } = await supabase
      .from("loyalty_logs")
      .select(
        "customer_id, stamps_added, rewards_granted, reward_redeemed, created_at",
      );

    if (logsErr) throw new Error(logsErr.message);

    const { data: passes, error: passesErr } = await supabase
      .from("loyalty_passes")
      .select("wallet_type");

    if (passesErr) throw new Error(passesErr.message);

    const rows = (customers ?? []) as CustomerRow[];
    const logsList = logs ?? [];

    const stampsIssued = logsList.reduce(
      (sum, log) => sum + Math.max(0, log.stamps_added),
      0,
    );
    const rewardsRedeemed = logsList.reduce(
      (sum, log) => sum + (log.rewards_granted ?? 0),
      0,
    );

    const ordersByCustomer = logsList.reduce<Record<string, number>>(
      (acc, log) => {
        acc[log.customer_id] = (acc[log.customer_id] ?? 0) + 1;
        return acc;
      },
      {},
    );

    const recurringCustomers = rows.filter(
      (customer) => (ordersByCustomer[customer.id] ?? 0) > 1,
    ).length;

    const walletBreakdown = (passes ?? []).reduce<Record<string, number>>(
      (acc, pass) => {
        acc[pass.wallet_type] = (acc[pass.wallet_type] ?? 0) + 1;
        return acc;
      },
      {},
    );

    const topCustomers = [...rows]
      .sort(
        (a, b) =>
          b.total_rewards_claimed - a.total_rewards_claimed ||
          b.stamps_count - a.stamps_count,
      )
      .slice(0, 10)
      .map((customer) => ({
        id: customer.id,
        fullName: customer.full_name,
        phone: customer.phone,
        stampsCount: customer.stamps_count,
        totalRewardsClaimed: customer.total_rewards_claimed,
        createdAt: customer.created_at,
      }));

    return NextResponse.json({
      totals: {
        totalCustomers: totalCustomers ?? rows.length,
        stampsIssued,
        rewardsRedeemed,
        recurringCustomers,
      },
      walletBreakdown,
      topCustomers,
    });
  } catch (error) {
    console.error("Error fetching loyalty metrics:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Error fetching loyalty metrics",
      },
      { status: 500 },
    );
  }
}
