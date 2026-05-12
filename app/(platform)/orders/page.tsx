import { SectionHeader } from "@/components/common/section-header";
import { OrdersHistory } from "@/components/orders/orders-history";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Tickets"
        title="Pedidos"
        description="Consulta el historial del día, verifica estados de sincronización y revisa tickets rápidamente."
        badge="Order log"
      />
      <OrdersHistory />
    </div>
  );
}
