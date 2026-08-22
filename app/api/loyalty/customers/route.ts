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
    const { data: customers, error: listErr } = await supabase
      .from("customers")
      .select(
        "id, full_name, phone, email, stamps_count, total_rewards_claimed, created_at, updated_at",
      )
      .order("created_at", { ascending: false })
      .limit(2000);

    if (listErr) throw new Error(listErr.message);

    const { data: logs, error: logsErr } = await supabase
      .from("loyalty_logs")
      .select(
        "customer_id, stamps_added, rewards_granted, reward_redeemed, created_at",
      );

    if (logsErr) throw new Error(logsErr.message);

    const logsByCustomer = (logs ?? []).reduce<
      Record<
        string,
        {
          totalStamps: number;
          rewardsClaimed: number;
          lastActivity: string;
          orderCount: number;
        }
      >
    >((acc, log) => {
      const entry = acc[log.customer_id] ?? {
        totalStamps: 0,
        rewardsClaimed: 0,
        lastActivity: log.created_at,
        orderCount: 0,
      };

      entry.totalStamps += Math.max(0, log.stamps_added);
      entry.rewardsClaimed += log.rewards_granted ?? 0;
      entry.orderCount += 1;

      if (log.created_at > entry.lastActivity) {
        entry.lastActivity = log.created_at;
      }

      acc[log.customer_id] = entry;
      return acc;
    }, {});

    const rows = (customers ?? []) as CustomerRow[];

    const history = rows.map((customer) => {
      const activity = logsByCustomer[customer.id] ?? {
        totalStamps: 0,
        rewardsClaimed: 0,
        lastActivity: null,
        orderCount: 0,
      };

      return {
        id: customer.id,
        fullName: customer.full_name,
        phone: customer.phone,
        email: customer.email,
        currentStamps: customer.stamps_count,
        totalRewardsClaimed: customer.total_rewards_claimed,
        lifetimeStamps: activity.totalStamps,
        orders: activity.orderCount,
        lastActivity: activity.lastActivity,
        createdAt: customer.created_at,
      };
    });

    return NextResponse.json({ customers: history });
  } catch (error) {
    console.error("Error fetching loyalty customers:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Error fetching loyalty customers",
      },
      { status: 500 },
    );
  }
}
