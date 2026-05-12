import { SectionHeader } from "@/components/common/section-header";
import { CashRegisterPanel } from "@/components/dashboard/cash-register-panel";

export default function CashPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Caja"
        title="Apertura y cierre"
        description="Controla efectivo inicial, esperado y diferencias al cierre del turno."
        badge="Cash control"
      />
      <CashRegisterPanel />
    </div>
  );
}
