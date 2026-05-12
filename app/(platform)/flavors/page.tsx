"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/common/section-header";
import { ActiveFlavorManager } from "@/components/dashboard/active-flavor-manager";
import { useAuthStore } from "@/stores/auth-store";

export default function FlavorsPage() {
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
      <div className="flex h-screen items-center justify-center">
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
        title="Sabores Activos"
        description="Asigna sabores activos a los tres tanques del día y controla la rotación desde datos persistidos."
        badge="3 tanks"
      />
      <ActiveFlavorManager />
    </div>
  );
}
