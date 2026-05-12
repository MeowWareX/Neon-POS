import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function KpiCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-muted text-sm">{label}</p>
          <TrendingUp className="text-secondary size-4" />
        </div>
        <p className="mt-4 text-3xl font-semibold">{value}</p>
        <p className="text-muted mt-2 text-sm">{hint}</p>
      </CardContent>
    </Card>
  );
}
