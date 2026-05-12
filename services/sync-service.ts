"use client";

import { orderSyncSchema } from "@/schemas/order";
import { syncOrderRemote } from "@/repositories/order-repository";
import type { Order } from "@/types/domain";

export async function syncPendingOrders(orders: Order[]) {
  const pendingOrders = orders.filter((order) => order.syncState === "pending");

  const syncedIds: string[] = [];

  for (const order of pendingOrders) {
    const parsed = orderSyncSchema.parse(order);
    const result = await syncOrderRemote(parsed);

    if (result.synced) {
      syncedIds.push(order.id);
    }
  }

  return syncedIds;
}
