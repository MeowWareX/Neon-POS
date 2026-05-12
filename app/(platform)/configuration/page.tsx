"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/common/section-header";
import { ConfigurationManager } from "@/components/dashboard/configuration-manager";
import { useAuthStore } from "@/stores/auth-store";

export default function ConfigurationPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    setIsLoading(false);
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Admin mode"
        title="Configuración"
        description="Gestiona tamaños, tipos, extras y sabores desde una sola vista conectada a la base de datos."
        badge="Catalog sync"
      />
      <ConfigurationManager />
    </div>
  );
}
