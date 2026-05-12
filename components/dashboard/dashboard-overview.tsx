"use client";

import { EmptyState } from "@/components/common/empty-state";
import { SalesTrendChart } from "@/components/charts/sales-trend-chart";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import {
  getPaymentsBreakdown,
  getSalesTrend,
  getTopEntities,
  summarizeOrders,
} from "@/lib/analytics";
import { compactNumber, currency } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";

export function DashboardOverview() {
  const { orders, sizes, productTypes, flavors, extras } = useAppStore(
    useShallow((state) => ({
      orders: state.orders,
      sizes: state.sizes,
      productTypes: state.productTypes,
      flavors: state.flavors,
      extras: state.extras,
    })),
  );

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={BarChart3}
        title="Sin ventas todavía"
        description="Cuando registres los primeros pedidos verás métricas diarias, tendencias y rankings."
      />
    );
  }

  const summary = summarizeOrders(orders);
  const trend = getSalesTrend(orders);
  const tops = getTopEntities({ orders, sizes, productTypes, flavors, extras });
  const paymentBreakdown = getPaymentsBreakdown(orders);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Ventas de hoy"
          value={currency(summary.today.sales)}
          hint={`${summary.today.count} pedidos`}
        />
        <KpiCard
          label="Ventas semana"
          value={currency(summary.weekly.sales)}
          hint={`${summary.weekly.count} tickets`}
        />
        <KpiCard
          label="Ventas mes"
          value={currency(summary.monthly.sales)}
          hint={`${summary.monthly.count} tickets`}
        />
        <KpiCard
          label="Ticket promedio"
          value={currency(summary.averageTicket)}
          hint="Promedio de orden"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Tendencia semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesTrendChart data={trend} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pagos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {paymentBreakdown.map((entry) => (
              <div
                key={entry.name}
                className="flex items-center justify-between rounded-[1.2rem] border border-white/10 bg-white/4 px-4 py-3"
              >
                <Badge variant="muted">{entry.name}</Badge>
                <p className="font-semibold">{currency(entry.value)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <TopCard title="Top productos" data={tops.products} />
        <TopCard title="Top sabores" data={tops.flavors} />
        <TopCard title="Top extras" data={tops.extras} />
      </div>
    </div>
  );
}

function TopCard({
  title,
  data,
}: {
  title: string;
  data: Array<{ label: string; total: number }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-[1.2rem] border border-white/10 bg-white/4 px-4 py-3"
          >
            <p className="text-sm">{item.label}</p>
            <Badge variant="secondary">{compactNumber(item.total)}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
