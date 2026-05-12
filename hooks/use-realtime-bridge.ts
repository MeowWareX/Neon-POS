"use client";

import { useEffect } from "react";
import { CATALOG_UPDATE_KEY, STORAGE_KEY } from "@/lib/constants";
import { useAppStore } from "@/stores/app-store";

export function useRealtimeBridge() {
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        void useAppStore.persist.rehydrate();
        return;
      }

      if (event.key === CATALOG_UPDATE_KEY) {
        void useAppStore.getState().refreshCatalog();
      }
    };

    const handleCatalogUpdate = () => {
      void useAppStore.getState().refreshCatalog();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("catalog-updated", handleCatalogUpdate);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("catalog-updated", handleCatalogUpdate);
    };
  }, []);
}
