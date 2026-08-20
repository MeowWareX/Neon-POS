import { SectionHeader } from "@/components/common/section-header";
import { LoyaltyOverview } from "@/components/dashboard/loyalty-overview";

export default function LoyaltyPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="NEON Club"
        title="Fidelización"
        description="Métricas de clientes, sellos emitidos, premios redimidos e historial exportable."
        badge="Loyalty"
      />
      <LoyaltyOverview />
    </div>
  );
}
