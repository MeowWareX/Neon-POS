import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  ActiveFlavor,
  CashSession,
  Expense,
  InventoryMovement,
  LiquidInventoryItem,
  LiquidInventoryMovement,
  LiquidMovementType,
  LiquidSale,
  LiquidVariantCode,
  LoanPayment,
  PaymentMethod,
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

// Configuration management functions
export async function updateProductSizeWithSupabase(
  supabase: SupabaseClient<Database>,
  id: string,
  updates: {
    label?: string;
    price?: number;
    baseCost?: number;
    inventoryItemId?: string | null;
    usageQuantity?: number;
  },
) {
  if (updates.label !== undefined) {
    const { error } = await supabase
      .from("product_sizes")
      .update({ label: updates.label })
      .eq("id", id);
    if (error) throw new Error(error.message);
  }

  if (updates.price !== undefined) {
    const { error } = await supabase
      .from("product_sizes")
      .update({ base_price: updates.price })
      .eq("id", id);
    if (error) throw new Error(error.message);
  }

  if (updates.baseCost !== undefined) {
    const { error } = await supabase
      .from("product_sizes")
      .update({ base_cost: updates.baseCost })
      .eq("id", id);
    if (error) throw new Error(error.message);
  }

  if (updates.inventoryItemId !== undefined) {
    const { error } = await supabase
      .from("product_sizes")
      .update({ inventory_item_id: updates.inventoryItemId })
      .eq("id", id);
    if (error) throw new Error(error.message);
  }

  if (updates.usageQuantity !== undefined) {
    const { error } = await supabase
      .from("product_sizes")
      .update({ usage_quantity: updates.usageQuantity })
      .eq("id", id);
    if (error) throw new Error(error.message);
  }
}

export async function createProductSizeWithSupabase(
  supabase: SupabaseClient<Database>,
  size: {
    code: string;
    label: string;
    ounces: number;
    price: number;
    baseCost: number;
    inventoryItemId?: string | null;
    usageQuantity?: number;
  },
) {
  const { data, error } = await supabase
    .from("product_sizes")
    .insert({
      code: size.code,
      label: size.label,
      ounces: size.ounces,
      base_price: size.price,
      base_cost: size.baseCost,
      inventory_item_id: size.inventoryItemId ?? null,
      usage_quantity: size.usageQuantity ?? 1,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteProductSizeWithSupabase(
  supabase: SupabaseClient<Database>,
  id: string,
) {
  const { error } = await supabase.from("product_sizes").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateProductTypeWithSupabase(
  supabase: SupabaseClient<Database>,
  id: string,
  updates: {
    label?: string;
    priceModifier?: number;
    costModifier?: number;
    inventoryItemId?: string | null;
    usageQuantity?: number;
  },
) {
  if (updates.label !== undefined) {
    const { error } = await supabase
      .from("product_types")
      .update({ label: updates.label })
      .eq("id", id);
    if (error) throw new Error(error.message);
  }

  if (updates.priceModifier !== undefined) {
    const { error } = await supabase
      .from("product_types")
      .update({ price_modifier: updates.priceModifier })
      .eq("id", id);
    if (error) throw new Error(error.message);
  }

  if (updates.costModifier !== undefined) {
    const { error } = await supabase
      .from("product_types")
      .update({ cost_modifier: updates.costModifier })
      .eq("id", id);
    if (error) throw new Error(error.message);
  }

  if (updates.inventoryItemId !== undefined) {
    const { error } = await supabase
      .from("product_types")
      .update({ inventory_item_id: updates.inventoryItemId })
      .eq("id", id);
    if (error) throw new Error(error.message);
  }

  if (updates.usageQuantity !== undefined) {
    const { error } = await supabase
      .from("product_types")
      .update({ usage_quantity: updates.usageQuantity })
      .eq("id", id);
    if (error) throw new Error(error.message);
  }
}

export async function createProductTypeWithSupabase(
  supabase: SupabaseClient<Database>,
  type: {
    code: string;
    label: string;
    priceModifier: number;
    costModifier: number;
    inventoryItemId?: string | null;
    usageQuantity?: number;
  },
) {
  const { data, error } = await supabase
    .from("product_types")
    .insert({
      code: type.code,
      label: type.label,
      price_modifier: type.priceModifier,
      cost_modifier: type.costModifier,
      inventory_item_id: type.inventoryItemId ?? null,
      usage_quantity: type.usageQuantity ?? 1,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteProductTypeWithSupabase(
  supabase: SupabaseClient<Database>,
  id: string,
) {
  const { error } = await supabase.from("product_types").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateExtraWithSupabase(
  supabase: SupabaseClient<Database>,
  id: string,
  updates: {
    name?: string;
    price?: number;
    cost?: number;
    inventoryItemId?: string | null;
    usageQuantity?: number;
  },
) {
  if (updates.name !== undefined) {
    const { error } = await supabase
      .from("extras")
      .update({ name: updates.name })
      .eq("id", id);
    if (error) throw new Error(error.message);
  }

  if (updates.price !== undefined) {
    const { error } = await supabase
      .from("extras")
      .update({ price: updates.price })
      .eq("id", id);
    if (error) throw new Error(error.message);
  }

  if (updates.cost !== undefined) {
    const { error } = await supabase
      .from("extras")
      .update({ cost: updates.cost })
      .eq("id", id);
    if (error) throw new Error(error.message);
  }

  if (updates.inventoryItemId !== undefined) {
    const { error } = await supabase
      .from("extras")
      .update({ inventory_item_id: updates.inventoryItemId })
      .eq("id", id);
    if (error) throw new Error(error.message);
  }

  if (updates.usageQuantity !== undefined) {
    const { error } = await supabase
      .from("extras")
      .update({ usage_quantity: updates.usageQuantity })
      .eq("id", id);
    if (error) throw new Error(error.message);
  }
}

export async function createExtraWithSupabase(
  supabase: SupabaseClient<Database>,
  extra: {
    name: string;
    price: number;
    cost: number;
    inventoryItemId?: string | null;
    usageQuantity?: number;
  },
) {
  const { data, error } = await supabase
    .from("extras")
    .insert({
      name: extra.name,
      price: extra.price,
      cost: extra.cost,
      inventory_item_id: extra.inventoryItemId ?? null,
      usage_quantity: extra.usageQuantity ?? 1,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteExtraWithSupabase(
  supabase: SupabaseClient<Database>,
  id: string,
) {
  const { error } = await supabase.from("extras").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateFlavorWithSupabase(
  supabase: SupabaseClient<Database>,
  id: string,
  updates: {
    name?: string;
    color?: string;
    isActive?: boolean;
  },
) {
  if (updates.name !== undefined) {
    const { error } = await supabase
      .from("flavors")
      .update({ name: updates.name })
      .eq("id", id);
    if (error) throw new Error(error.message);
  }

  if (updates.color !== undefined) {
    const { error } = await supabase
      .from("flavors")
      .update({ color: updates.color })
      .eq("id", id);
    if (error) throw new Error(error.message);
  }

  if (updates.isActive !== undefined) {
    const { error } = await supabase
      .from("flavors")
      .update({ is_active: updates.isActive })
      .eq("id", id);
    if (error) throw new Error(error.message);
  }
}

export async function createFlavorWithSupabase(
  supabase: SupabaseClient<Database>,
  flavor: {
    name: string;
    color: string;
    isActive: boolean;
  },
) {
  const { data, error } = await supabase
    .from("flavors")
    .insert({
      name: flavor.name,
      color: flavor.color,
      is_active: flavor.isActive,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteFlavorWithSupabase(
  supabase: SupabaseClient<Database>,
  id: string,
) {
  const { error } = await supabase.from("flavors").delete().eq("id", id);

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

export async function insertLiquidSaleWithSupabase(
  supabase: SupabaseClient<Database>,
  sale: LiquidSale,
) {
  const { error } = await supabase.from("liquid_sales").insert({
    id: sale.id,
    sale_date: sale.saleDate,
    variant: sale.variant,
    flavor_id: sale.flavorId ?? null,
    flavor_name: sale.flavorName ?? null,
    quantity: sale.quantity,
    unit_price: sale.unitPrice,
    total: sale.total,
    payment_method: sale.paymentMethod,
    customer_name: sale.customerName ?? null,
    notes: sale.notes ?? null,
    created_at: sale.createdAt,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function getLiquidSalesWithSupabase(
  supabase: SupabaseClient<Database>,
): Promise<LiquidSale[]> {
  const { data, error } = await supabase
    .from("liquid_sales")
    .select("*")
    .is("deleted_at", null)
    .order("sale_date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map((row) => ({
    id: row.id,
    saleDate: row.sale_date,
    variant: row.variant as LiquidVariantCode,
    flavorId: row.flavor_id,
    flavorName: row.flavor_name,
    quantity: Number(row.quantity),
    unitPrice: Number(row.unit_price),
    total: Number(row.total),
    paymentMethod: row.payment_method as PaymentMethod,
    customerName: row.customer_name,
    notes: row.notes,
    syncState: "synced",
    createdAt: row.created_at,
  }));
}

export async function deleteLiquidSaleWithSupabase(
  supabase: SupabaseClient<Database>,
  id: string,
) {
  const { error } = await supabase.from("liquid_sales").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getLiquidInventoryWithSupabase(
  supabase: SupabaseClient<Database>,
): Promise<LiquidInventoryItem[]> {
  const { data, error } = await supabase
    .from("liquid_inventory")
    .select("*")
    .is("deleted_at", null)
    .order("flavor_name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map((row) => ({
    id: row.id,
    flavorId: row.flavor_id,
    flavorName: row.flavor_name,
    variant: row.variant as LiquidVariantCode | null,
    currentStock: Number(row.current_stock),
    unit: row.unit,
    minStock: Number(row.min_stock),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function getLiquidMovementsWithSupabase(
  supabase: SupabaseClient<Database>,
): Promise<LiquidInventoryMovement[]> {
  const { data, error } = await supabase
    .from("liquid_inventory_movements")
    .select("*, liquid_inventory(flavor_name)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  type LiquidMovementRow =
    Database["public"]["Tables"]["liquid_inventory_movements"]["Row"] & {
      liquid_inventory?: { flavor_name?: string } | null;
    };

  return (data || []).map((row: LiquidMovementRow) => ({
    id: row.id,
    liquidInventoryId: row.liquid_inventory_id,
    flavorName: row.liquid_inventory?.flavor_name || "Desconocido",
    movementType: row.movement_type as LiquidMovementType,
    quantity: Number(row.quantity),
    notes: row.notes,
    referenceId: row.reference_id,
    createdAt: row.created_at,
  }));
}

export async function upsertLiquidInventoryItemWithSupabase(
  supabase: SupabaseClient<Database>,
  item: LiquidInventoryItem,
) {
  const { error } = await supabase.from("liquid_inventory").upsert({
    id: item.id,
    flavor_id: item.flavorId ?? null,
    flavor_name: item.flavorName,
    variant: item.variant ?? null,
    current_stock: item.currentStock,
    unit: item.unit ?? "bolsa",
    min_stock: item.minStock ?? 2,
    updated_at: item.updatedAt || new Date().toISOString(),
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function recordLiquidMovementWithSupabase(
  supabase: SupabaseClient<Database>,
  movement: LiquidInventoryMovement,
) {
  const { error } = await supabase.from("liquid_inventory_movements").insert({
    id: movement.id,
    liquid_inventory_id: movement.liquidInventoryId,
    movement_type: movement.movementType,
    quantity: movement.quantity,
    notes: movement.notes ?? null,
    reference_id: movement.referenceId ?? null,
    created_at: movement.createdAt,
  });

  if (error) {
    throw new Error(error.message);
  }
}
