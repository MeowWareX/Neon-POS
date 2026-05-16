"use client";

import { useEffect } from "react";
import { useAppStore } from "@/stores/app-store";

/**
 * Hook para sincronizar periódicamente las sesiones de caja y órdenes desde la base de datos
 * Esto asegura que los datos estén siempre actualizados y consistentes entre dispositivos
 */
export function useCashSessionSync(intervalMs: number = 30000) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Sincronizar inmediatamente al montar
    const syncNow = async () => {
      if (!navigator.onLine) return;

      try {
        const [sessionsRes, ordersRes] = await Promise.all([
          fetch("/api/cash-sessions"),
          fetch("/api/orders/list"),
        ]);

        if (!sessionsRes.ok || !ordersRes.ok) {
          console.warn("Failed to fetch sync data");
          return;
        }

        const { sessions } = await sessionsRes.json();
        const orders = await ordersRes.json();

        if (sessions || orders) {
          const updateData: Record<string, unknown> = {};
          if (sessions?.length > 0) {
            updateData.cashSessions = sessions;
          }
          if (orders?.length > 0) {
            updateData.orders = orders;
          }
          if (Object.keys(updateData).length > 0) {
            useAppStore.setState(updateData);
          }
        }
      } catch (error) {
        console.error("Failed to sync data:", error);
      }
    };

    syncNow();

    // Configurar sincronización periódica
    const interval = setInterval(syncNow, intervalMs);

    // Sincronizar cuando se recupera la conexión
    const handleOnline = () => syncNow();
    window.addEventListener("online", handleOnline);

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", handleOnline);
    };
  }, [intervalMs]);
}
