import type { SupabaseClient } from "@supabase/supabase-js";
import {
  EXTRA_TO_INVENTORY_ITEM_ID,
  SIZE_TO_INVENTORY_ITEM_ID,
} from "@/lib/catalog-ids";
import type { OrderSyncInput } from "@/schemas/order";
import type { Database } from "@/types/database";

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
  const orderPayload = {
    id: order.id,
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

  const items = order.items.map((item) => ({
    id: item.id,
    order_id: order.id,
    product_size_id: item.sizeId,
    product_type_id: item.typeId,
    flavor_id: item.flavorId,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    unit_cost: item.unitCost,
    line_total: item.lineTotal,
  }));

  const { error: itemError } = await supabase.from("order_items").insert(items);

  if (itemError) {
    throw new Error(itemError.message);
  }

  const orderExtras = order.items.flatMap((item) =>
    item.extraIds.map((extraId) => ({
      order_item_id: item.id,
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
