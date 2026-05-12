import { SectionHeader } from "@/components/common/section-header";
import { PosTerminal } from "@/components/pos/pos-terminal";

export default function PosPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Operator mode"
        title="Punto de venta"
        description="Flujo táctil de seis pasos para cerrar pedidos en segundos con soporte offline."
        badge="Prioridad: velocidad"
      />
      <PosTerminal />
    </div>
  );
}
