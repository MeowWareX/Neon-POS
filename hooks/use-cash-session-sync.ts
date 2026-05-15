"use client";

import { useEffect } from "react";
import { useAppStore } from "@/stores/app-store";

/**
 * Hook para sincronizar periódicamente las sesiones de caja desde la base de datos
 * Esto asegura que los datos estén siempre actualizados y consistentes entre dispositivos
 */
export function useCashSessionSync(intervalMs: number = 30000) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Sincronizar inmediatamente al montar
    const syncNow = async () => {
      if (!navigator.onLine) return;

      try {
        const response = await fetch("/api/cash-sessions");
        if (!response.ok) return;

        const { sessions } = await response.json();
        
        // Solo actualizar si hay sesiones nuevas o cambios
        if (sessions && sessions.length > 0) {
          useAppStore.setState({ cashSessions: sessions });
        }
      } catch (error) {
        console.error("Failed to sync cash sessions:", error);
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
