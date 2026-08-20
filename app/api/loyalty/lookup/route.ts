import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get("phone");

  if (!phone || phone.length < 7) {
    return NextResponse.json({ error: "Phone required" }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 503 },
    );
  }

  const { data: customer, error } = await supabase
    .from("customers")
    .select("id, full_name, phone, email, stamps_count, total_rewards_claimed")
    .eq("phone", phone)
    .maybeSingle();

  if (error || !customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  const { data: pass } = await supabase
    .from("loyalty_passes")
    .select("pass_token")
    .eq("customer_id", customer.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return NextResponse.json({
    id: customer.id,
    fullName: customer.full_name,
    phone: customer.phone,
    email: customer.email,
    stampsCount: customer.stamps_count,
    totalRewardsClaimed: customer.total_rewards_claimed,
    passToken: pass?.pass_token ?? "",
  });
}
