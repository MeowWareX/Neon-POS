"use client";

import { orderSyncSchema } from "@/schemas/order";
import { syncOrderRemote } from "@/repositories/order-repository";
import type { Order } from "@/types/domain";

function normalizePaymentMethod(paymentMethod: string): "cash" | "nequi" {
  const normalized = paymentMethod.toLowerCase().trim();

  if (normalized === "nequi") {
    return "nequi";
  }

  return "cash";
}

function normalizeOrderForSync(order: Order) {
  return {
    ...order,
    paymentMethod: normalizePaymentMethod(order.paymentMethod),
  };
}

export async function syncPendingOrders(orders: Order[]) {
  const pendingOrders = orders.filter((order) => order.syncState === "pending");

  const syncedIds: string[] = [];
  const errors: Array<{ orderId: string; error: string }> = [];

  for (const order of pendingOrders) {
    try {
      const parsed = orderSyncSchema.parse(normalizeOrderForSync(order));
      const result = await syncOrderRemote(parsed);

      if (result.synced) {
        syncedIds.push(order.id);
      } else {
        errors.push({
          orderId: order.id,
          error: result.message ?? "Sync failed",
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`Error syncing order ${order.id}:`, errorMessage);
      errors.push({
        orderId: order.id,
        error: errorMessage,
      });
    }
  }

  if (errors.length > 0) {
    console.warn("Sync errors:", errors);
  }

  return syncedIds;
}
