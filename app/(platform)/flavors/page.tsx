import { SectionHeader } from "@/components/common/section-header";
import { FlavorManager } from "@/components/dashboard/flavor-manager";

export default function FlavorsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Daily setup"
        title="Sabores"
        description="Asigna sabores activos a los tres tanques del día y controla la rotación."
        badge="3 tanks"
      />
      <FlavorManager />
    </div>
  );
}
