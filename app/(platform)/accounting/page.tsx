import { SectionHeader } from "@/components/common/section-header";
import { AccountingOverview } from "@/components/dashboard/accounting-overview";

export default function AccountingPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Accounting"
        title="Finanzas"
        description="Registra gastos, pagos de préstamos y estimación diaria de utilidad."
        badge="Profit view"
      />
      <AccountingOverview />
    </div>
  );
}
