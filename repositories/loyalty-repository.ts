import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type {
  LoyaltyCustomer,
  LoyaltyPass,
  LoyaltyLog,
  WalletType,
} from "@/types/domain";
import { env } from "@/lib/env";

type CustomerRow = Database["public"]["Tables"]["customers"]["Row"];
type CustomerInsert = Database["public"]["Tables"]["customers"]["Insert"];
type LoyaltyPassRow = Database["public"]["Tables"]["loyalty_passes"]["Row"];
type LoyaltyPassInsert =
  Database["public"]["Tables"]["loyalty_passes"]["Insert"];

type LoyaltyLogRow = Database["public"]["Tables"]["loyalty_logs"]["Row"];
type LoyaltyLogInsert = Database["public"]["Tables"]["loyalty_logs"]["Insert"];

function mapCustomer(row: CustomerRow): LoyaltyCustomer {
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email,
    stampsCount: row.stamps_count,
    totalRewardsClaimed: row.total_rewards_claimed,
    createdAt: row.created_at,
  };
}

function mapPass(row: LoyaltyPassRow): LoyaltyPass {
  return {
    id: row.id,
    customerId: row.customer_id,
    walletType: row.wallet_type as WalletType,
    passToken: row.pass_token,
    pushToken: row.push_token,
    lastSyncedAt: row.last_synced_at,
    createdAt: row.created_at,
  };
}

function mapLog(row: LoyaltyLogRow): LoyaltyLog {
  return {
    id: row.id,
    customerId: row.customer_id,
    orderId: row.order_id,
    stampsAdded: row.stamps_added,
    rewardRedeemed: row.reward_redeemed,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

export interface RegisterResult {
  customer: LoyaltyCustomer;
  pass: LoyaltyPass;
  webUrl: string;
}

async function findCustomerByPhoneRaw(
  supabase: SupabaseClient<Database>,
  phone: string,
): Promise<CustomerRow | null> {
  const { data } = await supabase
    .from("customers")
    .select()
    .eq("phone", phone)
    .maybeSingle();

  return data ?? null;
}

async function findExistingWebPass(
  supabase: SupabaseClient<Database>,
  customerId: string,
): Promise<LoyaltyPassRow | null> {
  const { data } = await supabase
    .from("loyalty_passes")
    .select()
    .eq("customer_id", customerId)
    .eq("wallet_type", "web")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return data ?? null;
}

export async function registerCustomer(
  supabase: SupabaseClient<Database>,
  input: { fullName: string; phone: string; email?: string },
): Promise<RegisterResult> {
  const existingEmail = input.email
    ? await findCustomerByEmail(supabase, input.email)
    : null;

  if (existingEmail) {
    throw new Error("EmailUnregistered");
  }

  const phoneExists = await findCustomerByPhoneRaw(supabase, input.phone);
  let customerId: string;

  if (phoneExists) {
    customerId = phoneExists.id;
  } else {
    const { data: newCustomer, error: custErr } = await supabase
      .from("customers")
      .insert({
        full_name: input.fullName,
        phone: input.phone,
        email: input.email ?? null,
      } satisfies CustomerInsert)
      .select()
      .single();

    if (custErr || !newCustomer) {
      throw new Error(custErr?.message ?? "Failed to create customer");
    }
    customerId = newCustomer.id;
  }

  const existingPass = await findExistingWebPass(supabase, customerId);

  let newPass: LoyaltyPassRow;
  let passToken: string;

  if (existingPass) {
    newPass = existingPass;
    passToken = existingPass.pass_token;
  } else {
    passToken = crypto.randomUUID();

    const { data: createdPass, error: passErr } = await supabase
      .from("loyalty_passes")
      .insert({
        customer_id: customerId,
        wallet_type: "web",
        pass_token: passToken,
      } satisfies LoyaltyPassInsert)
      .select()
      .single();

    if (passErr || !createdPass) {
      throw new Error(passErr?.message ?? "Failed to create loyalty pass");
    }
    newPass = createdPass;
  }

  const { data: customerRow, error: custErr2 } = await supabase
    .from("customers")
    .select()
    .eq("id", customerId)
    .single();

  if (custErr2 || !customerRow) {
    throw new Error(custErr2?.message ?? "Failed to fetch customer");
  }

  const customer = mapCustomer({
    ...customerRow,
    email: input.email ?? null,
  } as unknown as CustomerRow);
  const pass = mapPass(newPass);
  const webUrl = `${env.NEXT_PUBLIC_APP_URL ?? ""}/club/${passToken}`;

  return { customer, pass, webUrl };
}

export async function findCustomerByPhone(
  supabase: SupabaseClient<Database>,
  phone: string,
): Promise<LoyaltyCustomer | null> {
  const { data, error } = await supabase
    .from("customers")
    .select()
    .eq("phone", phone)
    .maybeSingle();

  if (error || !data) return null;
  return mapCustomer(data);
}

export async function getLoyaltyCardByToken(
  supabase: SupabaseClient<Database>,
  passToken: string,
): Promise<{
  customer: LoyaltyCustomer;
  pass: LoyaltyPass;
  recentLogs: LoyaltyLog[];
} | null> {
  const { data: passRow, error: passErr } = await supabase
    .from("loyalty_passes")
    .select()
    .eq("pass_token", passToken)
    .maybeSingle();

  if (passErr || !passRow) return null;

  const { data: customerRow, error: custErr } = await supabase
    .from("customers")
    .select()
    .eq("id", passRow.customer_id)
    .maybeSingle();

  if (custErr || !customerRow) return null;

  const { data: logsRows, error: logsErr } = await supabase
    .from("loyalty_logs")
    .select()
    .eq("customer_id", passRow.customer_id)
    .order("created_at", { ascending: false })
    .limit(10);

  if (logsErr) return null;

  return {
    customer: mapCustomer(customerRow),
    pass: mapPass(passRow),
    recentLogs: (logsRows ?? []).map(mapLog),
  };
}

export async function addStampsToCustomer(
  supabase: SupabaseClient<Database>,
  input: {
    passToken?: string;
    phone?: string;
    orderId?: string;
    stampsToAdd: number;
    redeemReward?: boolean;
  },
): Promise<{
  customer: LoyaltyCustomer;
  newStampsCount: number;
  rewardRedeemed: boolean;
  message: string;
}> {
  let customerRow: CustomerRow | null;

  if (input.passToken) {
    const { data: passRow } = await supabase
      .from("loyalty_passes")
      .select()
      .eq("pass_token", input.passToken)
      .maybeSingle();

    if (!passRow) throw new Error("Pass not found");

    const { data: custRow, error: custErr } = await supabase
      .from("customers")
      .select()
      .eq("id", passRow.customer_id)
      .maybeSingle();

    if (custErr || !custRow)
      throw new Error(custErr?.message ?? "Customer not found");
    customerRow = custRow;
  } else if (input.phone) {
    const { data: custRow, error: custErr } = await supabase
      .from("customers")
      .select()
      .eq("phone", input.phone)
      .maybeSingle();

    if (custErr || !custRow)
      throw new Error(custErr?.message ?? "Customer not found");
    customerRow = custRow;
  } else {
    throw new Error("passToken or phone is required");
  }

  const currentStamps = customerRow.stamps_count;

  let rewardRedeemed = false;
  let newStampsCount = currentStamps;

  if (input.redeemReward && currentStamps >= 10) {
    rewardRedeemed = true;
    newStampsCount = Math.max(0, currentStamps - 10);
  } else if (input.stampsToAdd > 0) {
    newStampsCount = Math.min(10, currentStamps + input.stampsToAdd);
  } else if (input.stampsToAdd < 0) {
    newStampsCount = Math.max(0, currentStamps + input.stampsToAdd);
  }

  const { data: updatedCustomer, error: updErr } = await supabase
    .from("customers")
    .update({
      stamps_count: newStampsCount,
      total_rewards_claimed: rewardRedeemed
        ? customerRow.total_rewards_claimed + 1
        : customerRow.total_rewards_claimed,
      updated_at: new Date().toISOString(),
    })
    .eq("id", customerRow.id)
    .select()
    .single();

  if (updErr || !updatedCustomer)
    throw new Error(updErr?.message ?? "Failed to update stamps");

  await supabase.from("loyalty_logs").insert({
    customer_id: customerRow.id,
    order_id: input.orderId ?? null,
    stamps_added: input.stampsToAdd,
    rewards_granted: rewardRedeemed ? 1 : 0,
    reward_redeemed: rewardRedeemed,
    notes: rewardRedeemed ? "Raspado gratis redimido" : undefined,
  } satisfies LoyaltyLogInsert);

  const nextReward = newStampsCount >= 10;
  const message = rewardRedeemed
    ? "¡Raspado gratis redimido!"
    : nextReward
      ? "¡Raspado gratis disponible!"
      : `Sellos actualizados: ${newStampsCount}/10`;

  return {
    customer: mapCustomer(updatedCustomer),
    newStampsCount,
    rewardRedeemed,
    message,
  };
}

async function findCustomerByEmail(
  supabase: SupabaseClient<Database>,
  email: string,
): Promise<LoyaltyCustomer | null> {
  const { data } = await supabase
    .from("customers")
    .select()
    .eq("email", email)
    .maybeSingle();

  return data ? mapCustomer(data) : null;
}
