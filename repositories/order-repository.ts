import type { SupabaseClient } from "@supabase/supabase-js";
import {
  EXTRA_TO_INVENTORY_ITEM_ID,
  SIZE_TO_INVENTORY_ITEM_ID,
} from "@/lib/catalog-ids";
import type { OrderSyncInput } from "@/schemas/order";
import type { Database } from "@/types/database";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizeUuid(value: string) {
  return UUID_PATTERN.test(value) ? value : crypto.randomUUID();
}

export async function syncOrderRemote(order: OrderSyncInput) {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    throw new Error("No se pudo sincronizar el pedido.");
  }

  return (await response.json()) as {
    synced: boolean;
    mode: "supabase" | "demo";
  };
}

export async function insertOrderWithSupabase(
  supabase: SupabaseClient<Database>,
  order: OrderSyncInput,
) {
  const normalizedOrderId = normalizeUuid(order.id);
  const normalizedItemIds = new Map<string, string>();

  const { data: existingById, error: existingByIdError } = await supabase
    .from("orders")
    .select("id")
    .eq("id", normalizedOrderId)
    .maybeSingle();

  if (existingByIdError) {
    throw new Error(existingByIdError.message);
  }

  if (existingById) {
    return;
  }

  const { data: existingByNumber, error: existingByNumberError } =
    await supabase
      .from("orders")
      .select("id")
      .eq("order_number", order.orderNumber)
      .maybeSingle();

  if (existingByNumberError) {
    throw new Error(existingByNumberError.message);
  }

  if (existingByNumber) {
    return;
  }

  const orderPayload = {
    id: normalizedOrderId,
    order_number: order.orderNumber,
    payment_method: order.paymentMethod,
    subtotal: order.subtotal,
    total: order.total,
    estimated_cost: order.estimatedCost,
    sync_state: "synced",
    created_at: order.createdAt,
  };

  const { error: orderError } = await supabase
    .from("orders")
    .insert(orderPayload);

  if (orderError) {
    throw new Error(orderError.message);
  }

  const items = order.items.map((item) => {
    const normalizedItemId = normalizeUuid(item.id);
    normalizedItemIds.set(item.id, normalizedItemId);

    return {
      id: normalizedItemId,
      order_id: normalizedOrderId,
      product_size_id: item.sizeId,
      product_type_id: item.typeId,
      flavor_id: item.flavorId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      unit_cost: item.unitCost,
      line_total: item.lineTotal,
    };
  });

  const { error: itemError } = await supabase.from("order_items").insert(items);

  if (itemError) {
    throw new Error(itemError.message);
  }

  const orderExtras = order.items.flatMap((item) =>
    item.extraIds.map((extraId) => ({
      order_item_id: normalizedItemIds.get(item.id) ?? item.id,
      extra_id: extraId,
    })),
  );

  if (orderExtras.length > 0) {
    const { error: extraError } = await supabase
      .from("order_item_extras")
      .insert(orderExtras);

    if (extraError) {
      throw new Error(extraError.message);
    }
  }

  const stockDeltas = new Map<string, number>();

  order.items.forEach((item) => {
    const cupInventoryId = SIZE_TO_INVENTORY_ITEM_ID[item.sizeId];
    if (cupInventoryId) {
      stockDeltas.set(
        cupInventoryId,
        (stockDeltas.get(cupInventoryId) ?? 0) - item.quantity,
      );
    }

    item.extraIds.forEach((extraId) => {
      const extraInventoryId = EXTRA_TO_INVENTORY_ITEM_ID[extraId];
      if (extraInventoryId) {
        stockDeltas.set(
          extraInventoryId,
          (stockDeltas.get(extraInventoryId) ?? 0) - item.quantity,
        );
      }
    });
  });

  const movements = Array.from(stockDeltas.entries()).map(
    ([inventoryItemId, quantity]) => ({
      id: crypto.randomUUID(),
      inventory_item_id: inventoryItemId,
      movement_type: "sale",
      quantity,
      note: `Pedido ${order.orderNumber}`,
      created_at: order.createdAt,
    }),
  );

  if (movements.length > 0) {
    const { error: movementError } = await supabase
      .from("inventory_movements")
      .insert(movements);

    if (movementError) {
      throw new Error(movementError.message);
    }

    for (const [inventoryItemId, quantity] of stockDeltas.entries()) {
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
          current_stock: Math.max(0, (data?.current_stock ?? 0) + quantity),
        })
        .eq("id", inventoryItemId);

      if (updateError) {
        throw new Error(updateError.message);
      }
    }
  }
}
