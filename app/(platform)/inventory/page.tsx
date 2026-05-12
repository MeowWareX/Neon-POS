import { SectionHeader } from "@/components/common/section-header";
import { InventoryOverview } from "@/components/inventory/inventory-overview";

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Supply"
        title="Inventario"
        description="Stock actual, alertas, ajustes y compras con deducción automática desde los pedidos."
        badge="Stock control"
      />
      <InventoryOverview />
    </div>
  );
}
