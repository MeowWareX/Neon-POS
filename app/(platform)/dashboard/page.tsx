import { SectionHeader } from "@/components/common/section-header";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Admin mode"
        title="Dashboard"
        description="Monitorea ventas diarias, tendencias y desempeño del catálogo en tiempo real."
        badge="Realtime ready"
      />
      <DashboardOverview />
    </div>
  );
}
