import { SectionHeader } from "@/components/common/section-header";
import { FinancialControl } from "@/components/financial/financial-control";

export default function AccountingPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Financial Control"
        title="Finanzas & Tesorería"
        description="Gestión de gastos, bolsillos de tesorería y carga de cierres históricos."
        badge="Control 360°"
      />
      <FinancialControl />
    </div>
  );
}
