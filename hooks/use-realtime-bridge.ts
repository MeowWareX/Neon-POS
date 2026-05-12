"use client";

import { useEffect } from "react";
import { STORAGE_KEY } from "@/lib/constants";
import { useAppStore } from "@/stores/app-store";

export function useRealtimeBridge() {
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        void useAppStore.persist.rehydrate();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);
}
