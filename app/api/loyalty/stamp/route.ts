import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { isGoogleWalletConfigured } from "@/lib/env";
import { loyaltyStampSchema } from "@/schemas/loyalty";
import {
  addStampsToCustomer,
  findCustomerByPhone,
  getLoyaltyCardByToken,
} from "@/repositories/loyalty-repository";
import { updateGoogleWalletPass } from "@/services/google-wallet.service";

export async function POST(request: NextRequest) {
  const json = await request.json();
  const body = loyaltyStampSchema.parse(json);

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 503 },
    );
  }

  try {
    const result = await addStampsToCustomer(supabase, body);

    if (isGoogleWalletConfigured) {
      const walletPass = await findPassForPush(supabase, body);

      if (walletPass) {
        updateGoogleWalletPass(
          walletPass.customer,
          walletPass.pass,
        ).catch((error) => {
          console.warn("Google Wallet push update failed:", error);
        });
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}

async function findPassForPush(
  supabase: NonNullable<ReturnType<typeof getSupabaseAdminClient>>,
  body: { passToken?: string; phone?: string; orderId?: string },
) {
  if (body.passToken) {
    return getLoyaltyCardByToken(supabase, body.passToken);
  }

  if (body.phone) {
    const customer = await findCustomerByPhone(supabase, body.phone);
    if (!customer) return null;

    const { data: passRow } = await supabase
      .from("loyalty_passes")
      .select()
      .eq("customer_id", customer.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!passRow) return null;

    return getLoyaltyCardByToken(supabase, passRow.pass_token);
  }

  return null;
}