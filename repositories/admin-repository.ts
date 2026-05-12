import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  ActiveFlavor,
  CashSession,
  Expense,
  InventoryMovement,
  LoanPayment,
  Purchase,
} from "@/types/domain";
import type { Database } from "@/types/database";

async function adjustInventoryStock(
  supabase: SupabaseClient<Database>,
  inventoryItemId: string,
  delta: number,
) {
  const { data, error } = await supabase
    .from("inventory_items")
    .select("current_stock")
    .eq("id", inventoryItemId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const { error: updateError } = await supabase
    .from("inventory_items")
    .update({
      current_stock: Math.max(0, (data?.current_stock ?? 0) + delta),
    })
    .eq("id", inventoryItemId);

  if (updateError) {
    throw new Error(updateError.message);
  }
}

export async function insertInventoryMovementWithSupabase(
  supabase: SupabaseClient<Database>,
  movement: InventoryMovement,
) {
  const { error } = await supabase.from("inventory_movements").insert({
    id: movement.id,
    inventory_item_id: movement.inventoryItemId,
    movement_type: movement.type,
    quantity: movement.quantity,
    note: movement.note,
    created_at: movement.createdAt,
  });

  if (error) {
    throw new Error(error.message);
  }

  await adjustInventoryStock(
    supabase,
    movement.inventoryItemId,
    movement.quantity,
  );
}

export async function insertPurchaseWithSupabase(
  supabase: SupabaseClient<Database>,
  purchase: Purchase,
) {
  const { error } = await supabase.from("purchases").insert({
    id: purchase.id,
    inventory_item_id: purchase.inventoryItemId,
    vendor: purchase.vendor,
    quantity: purchase.quantity,
    total: purchase.total,
    note: purchase.note ?? null,
    created_at: purchase.createdAt,
  });

  if (error) {
    throw new Error(error.message);
  }

  await insertInventoryMovementWithSupabase(supabase, {
    id: crypto.randomUUID(),
    inventoryItemId: purchase.inventoryItemId,
    type: "purchase",
    quantity: purchase.quantity,
    note: purchase.note ?? `Compra a ${purchase.vendor}`,
    createdAt: purchase.createdAt,
  });
}

export async function openCashSessionWithSupabase(
  supabase: SupabaseClient<Database>,
  session: CashSession,
) {
  const { error } = await supabase.from("cash_sessions").insert({
    id: session.id,
    opening_cash: session.openingCash,
    status: session.status,
    opened_at: session.openedAt,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function closeCashSessionWithSupabase(
  supabase: SupabaseClient<Database>,
  session: CashSession,
) {
  const { error } = await supabase
    .from("cash_sessions")
    .update({
      closing_cash: session.closingCash ?? null,
      expected_cash: session.expectedCash ?? null,
      difference: session.difference ?? null,
      status: session.status,
      closed_at: session.closedAt ?? null,
    })
    .eq("id", session.id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function insertExpenseWithSupabase(
  supabase: SupabaseClient<Database>,
  expense: Expense,
) {
  const { error } = await supabase.from("expenses").insert({
    id: expense.id,
    concept: expense.concept,
    amount: expense.amount,
    category: expense.category,
    created_at: expense.createdAt,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function insertLoanPaymentWithSupabase(
  supabase: SupabaseClient<Database>,
  payment: LoanPayment,
) {
  const { error } = await supabase.from("loan_payments").insert({
    id: payment.id,
    lender: payment.lender,
    amount: payment.amount,
    balance_after_payment: payment.balanceAfterPayment,
    created_at: payment.createdAt,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function syncActiveFlavorWithSupabase(
  supabase: SupabaseClient<Database>,
  input: Pick<ActiveFlavor, "flavorId" | "businessDate"> & {
    tankNumber: 1 | 2 | 3 | null;
  },
) {
  const { error: removeFlavorError } = await supabase
    .from("active_flavors")
    .delete()
    .eq("business_date", input.businessDate)
    .eq("flavor_id", input.flavorId);

  if (removeFlavorError) {
    throw new Error(removeFlavorError.message);
  }

  if (input.tankNumber !== null) {
    const { error: removeTankError } = await supabase
      .from("active_flavors")
      .delete()
      .eq("business_date", input.businessDate)
      .eq("tank_number", input.tankNumber);

    if (removeTankError) {
      throw new Error(removeTankError.message);
    }

    const { error: insertError } = await supabase
      .from("active_flavors")
      .insert({
        flavor_id: input.flavorId,
        business_date: input.businessDate,
        tank_number: input.tankNumber,
      });

    if (insertError) {
      throw new Error(insertError.message);
    }
  }
}
