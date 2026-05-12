"use client";

import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { syncPendingOrders } from "@/services/sync-service";
import { useAppStore } from "@/stores/app-store";

export function useOfflineSync() {
  const orders = useAppStore((state) => state.orders);
  const markOrdersSynced = useAppStore((state) => state.markOrdersSynced);
  const syncingRef = useRef(false);

  const runSync = useCallback(async () => {
    if (syncingRef.current || !window.navigator.onLine) {
      return;
    }

    const pendingCount = orders.filter(
      (order) => order.syncState === "pending",
    ).length;

    if (pendingCount === 0) {
      return;
    }

    try {
      syncingRef.current = true;
      const syncedIds = await syncPendingOrders(orders);

      if (syncedIds.length > 0) {
        markOrdersSynced(syncedIds);
        toast.success(`${syncedIds.length} pedido(s) sincronizados.`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      syncingRef.current = false;
    }
  }, [markOrdersSynced, orders]);

  useEffect(() => {
    void runSync();

    const handleOnline = () => {
      void runSync();
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [runSync]);
}
