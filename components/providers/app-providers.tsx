"use client";

import { useEffect } from "react";
import { AppToaster } from "@/components/ui/toaster";
import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration";
import { useOfflineSync } from "@/hooks/use-offline-sync";
import { useRealtimeBridge } from "@/hooks/use-realtime-bridge";
import { useAppStore } from "@/stores/app-store";

function Bootstrap() {
  const initialize = useAppStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useOfflineSync();
  useRealtimeBridge();

  return null;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Bootstrap />
      <ServiceWorkerRegistration />
      {children}
      <AppToaster />
    </>
  );
}
