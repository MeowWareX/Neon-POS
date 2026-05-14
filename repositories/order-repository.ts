import type { SupabaseClient } from "@supabase/supabase-js";
import { createOrderNumber } from "@/lib/business";
import { calculateInventoryConsumptionDeltas } from "@/lib/inventory-consumption";
import {
  mapExtraRow,
  mapInventoryConsumptionRuleRow,
  mapProductSizeRow,
} from "@/lib/catalog-mappers";
import type { OrderSyncInput } from "@/schemas/order";
import type { Database } from "@/types/database";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type InventoryConsumptionRuleRow =
  Database["public"]["Tables"]["inventory_consumption_rules"]["Row"];
type ProductSizeRow = Database["public"]["Tables"]["product_sizes"]["Row"];
type ExtraRow = Database["public"]["Tables"]["extras"]["Row"];
type FlavorRow = Database["public"]["Tables"]["flavors"]["Row"];

function normalizeUuid(value: string) {
  return UUID_PATTERN.test(value) ? value : crypto.randomUUID();
}

function parseOrderSequence(orderNumber: string) {
  const sequence = Number.parseInt(orderNumber.replace(/^N-/, ""), 10);

  return Number.isFinite(sequence) ? sequence : 0;
}

export async function getLatestOrderSequence(
  supabase: SupabaseClient<Database>,
) {
  const { data, error } = await supabase
    .from("orders")
    .select("order_number")
    .order("order_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data?.order_number ? parseOrderSequence(data.order_number) : 0;
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
    message?: string;
    orderNumber?: string;
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
    return { orderNumber: order.orderNumber };
  }

  let resolvedOrderNumber = order.orderNumber;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const latestSequence = await getLatestOrderSequence(supabase);
    resolvedOrderNumber = createOrderNumber(latestSequence);

    const orderPayload = {
      id: normalizedOrderId,
      order_number: resolvedOrderNumber,
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

    if (!orderError) {
      break;
    }

    if (orderError.code === "23505" && attempt < 2) {
      continue;
    }

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

  // Load consumption rules and flavors, but handle missing tables gracefully
  let rulesData: InventoryConsumptionRuleRow[] = [];
  let flavorsData: Partial<FlavorRow>[] = [];
  let sizesData: Partial<ProductSizeRow>[] = [];
  let extrasData: Partial<ExtraRow>[] = [];

  try {
    const { data: rules, error: rulesError } = await supabase
      .from("inventory_consumption_rules")
      .select()
      .eq("is_active", true);

    if (rulesError) {
      console.warn("Could not load consumption rules:", rulesError.message);
    } else {
      rulesData = rules ?? [];
    }
  } catch (e) {
    console.warn("Error loading consumption rules:", e);
  }

  try {
    const { data: sizes, error: sizesError } = await supabase
      .from("product_sizes")
      .select("id,inventory_item_id")
      .is("deleted_at", null);

    if (sizesError) {
      console.warn("Could not load product sizes:", sizesError.message);
    } else {
      sizesData = sizes ?? [];
    }
  } catch (e) {
    console.warn("Error loading product sizes:", e);
  }

  try {
    const { data: extras, error: extrasError } = await supabase
      .from("extras")
      .select("id,inventory_item_id")
      .is("deleted_at", null);

    if (extrasError) {
      console.warn("Could not load extras:", extrasError.message);
    } else {
      extrasData = extras ?? [];
    }
  } catch (e) {
    console.warn("Error loading extras:", e);
  }

  try {
    const { data: flavors, error: flavorsError } = await supabase
      .from("flavors")
      .select("id,inventory_item_id")
      .is("deleted_at", null);

    if (flavorsError) {
      console.warn("Could not load flavors:", flavorsError.message);
    } else {
      flavorsData = flavors ?? [];
    }
  } catch (e) {
    console.warn("Error loading flavors:", e);
  }

  const stockDeltas = new Map<string, number>();
  const inventoryConsumptionRules = rulesData.map(
    mapInventoryConsumptionRuleRow,
  );

  order.items.forEach((item) => {
    const deltas = calculateInventoryConsumptionDeltas(item, {
      sizes: sizesData.map(mapProductSizeRow),
      extras: extrasData.map(mapExtraRow),
      flavors: (flavorsData ?? [])
        .filter((flavor): flavor is Partial<FlavorRow> & { id: string } =>
          Boolean(flavor && flavor.id),
        )
        .map((flavor) => ({
          id: flavor.id,
          name: "",
          color: "",
          isActive: true,
          inventoryItemId: flavor.inventory_item_id ?? null,
        })),
      rules: inventoryConsumptionRules,
    });

    deltas.forEach((delta) => {
      stockDeltas.set(
        delta.inventoryItemId,
        (stockDeltas.get(delta.inventoryItemId) ?? 0) + delta.quantity,
      );
    });
  });

  const movements = Array.from(stockDeltas.entries()).map(
    ([inventoryItemId, quantity]) => ({
      id: crypto.randomUUID(),
      inventory_item_id: inventoryItemId,
      movement_type: "sale",
      quantity,
      note: `Pedido ${resolvedOrderNumber}`,
      created_at: order.createdAt,
    }),
  );

  if (movements.length > 0) {
    const { error: movementError } = await supabase
      .from("inventory_movements")
      .insert(movements);

    if (movementError) {
      console.warn(
        "Could not create inventory movements:",
        movementError.message,
      );
    }

    // Try to update inventory, but don't fail the order if it fails
    for (const [inventoryItemId, quantity] of stockDeltas.entries()) {
      try {
        const { data, error } = await supabase
          .from("inventory_items")
          .select("current_stock")
          .eq("id", inventoryItemId)
          .single();

        if (error) {
          console.warn(
            `Could not find inventory item ${inventoryItemId}:`,
            error.message,
          );
          continue;
        }

        if (!data) {
          console.warn(`Inventory item ${inventoryItemId} not found`);
          continue;
        }

        const { error: updateError } = await supabase
          .from("inventory_items")
          .update({
            current_stock: Math.max(0, (data.current_stock ?? 0) + quantity),
          })
          .eq("id", inventoryItemId);

        if (updateError) {
          console.warn(
            `Could not update inventory item ${inventoryItemId}:`,
            updateError.message,
          );
        }
      } catch (e) {
        console.warn(`Error updating inventory ${inventoryItemId}:`, e);
      }
    }
  }

  return { orderNumber: resolvedOrderNumber };
}
