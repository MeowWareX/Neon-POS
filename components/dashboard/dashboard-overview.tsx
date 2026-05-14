"use client";

import { format, isSameDay } from "date-fns";
import { EmptyState } from "@/components/common/empty-state";
import { SalesTrendChart } from "@/components/charts/sales-trend-chart";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { useEffect, useState } from "react";
import type { Order } from "@/types/domain";
import {
  getPaymentsBreakdown,
  getSalesTrend,
  getTopEntities,
  summarizeOrders,
  summarizeOrderSlice,
  getCountsBreakdown,
} from "@/lib/analytics";
import { compactNumber, currency } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";

export function DashboardOverview() {
  const { sizes, productTypes, flavors, extras } = useAppStore(
    useShallow((state) => ({
      sizes: state.sizes,
      productTypes: state.productTypes,
      flavors: state.flavors,
      extras: state.extras,
    })),
  );

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() =>
    format(new Date(), "yyyy-MM-dd"),
  );

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/orders/list", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error loading orders for dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading && orders.length === 0) {
    return (
      <div className="text-muted py-8 text-center">Cargando métricas...</div>
    );
  }

  if (!isLoading && orders.length === 0) {
    return (
      <EmptyState
        icon={BarChart3}
        title="Sin ventas todavía"
        description="Cuando registres los primeros pedidos verás métricas diarias, tendencias y rankings."
      />
    );
  }

  const summary = summarizeOrders(orders);
  const selectedDateValue = new Date(`${selectedDate}T00:00:00`);
  const selectedDayOrders = orders.filter((order) =>
    isSameDay(new Date(order.createdAt), selectedDateValue),
  );
  const selectedDaySummary = summarizeOrderSlice(selectedDayOrders);
  const trend = getSalesTrend(orders);
  const tops = getTopEntities({ orders, sizes, productTypes, flavors, extras });
  const paymentBreakdown = getPaymentsBreakdown(orders);
  const selectedDayPayments = getPaymentsBreakdown(selectedDayOrders);
  const counts = getCountsBreakdown({ orders, sizes, productTypes, flavors });
  const selectedDayCounts = getCountsBreakdown({
    orders: selectedDayOrders,
    sizes,
    productTypes,
    flavors,
  });
  const selectedDayLabel = format(selectedDateValue, "PPP");

  const paymentValue = (method: string, entries: Array<{ name: string; value: number }>) =>
    entries.find((entry) => entry.name === method)?.value ?? 0;

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

      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Métricas por día</CardTitle>
            <p className="text-muted mt-1 text-sm">
              Revisa el día de hoy o un día específico para decisiones y cierre.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(format(new Date(), "yyyy-MM-dd"))}
            >
              Hoy
            </Button>
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="h-10 rounded-full border border-white/10 bg-white/5 px-4 text-sm outline-none"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <KpiCard
              label={`Ventas ${selectedDayLabel}`}
              value={currency(selectedDaySummary.sales)}
              hint={`${selectedDaySummary.count} pedidos`}
            />
            <KpiCard
              label="Unidades vendidas"
              value={compactNumber(
                selectedDayOrders.reduce(
                  (sum, order) =>
                    sum +
                    order.items.reduce(
                      (itemSum, item) => itemSum + item.quantity,
                      0,
                    ),
                  0,
                ),
              )}
              hint="Total de unidades"
            />
            <KpiCard
              label="Efectivo"
              value={currency(paymentValue("cash", selectedDayPayments))}
              hint="Pagos en caja"
            />
            <KpiCard
              label="Nequi"
              value={currency(paymentValue("nequi", selectedDayPayments))}
              hint="Pagos por Nequi"
            />
            <KpiCard
              label="Ticket promedio"
              value={currency(selectedDaySummary.averageTicket)}
              hint="Promedio del día"
            />
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-3">
            <BreakdownCard
              title={`Tamaños ${selectedDayLabel}`}
              data={selectedDayCounts.sizes}
            />
            <BreakdownCard
              title={`Variaciones ${selectedDayLabel}`}
              data={selectedDayCounts.productTypes}
            />
            <BreakdownCard
              title={`Sabores ${selectedDayLabel}`}
              data={selectedDayCounts.flavors}
            />
          </div>
        </CardContent>
      </Card>

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

      <div className="grid gap-5 xl:grid-cols-3">
        <BreakdownCard title="Unidades por tamaño" data={counts.sizes} />
        <BreakdownCard
          title="Unidades por variación"
          data={counts.productTypes}
        />
        <BreakdownCard title="Unidades por sabor" data={counts.flavors} />
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

function BreakdownCard({
  title,
  data,
}: {
  title: string;
  data: Record<string, number>;
}) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {entries.length === 0 ? (
          <p className="text-muted text-sm">No hay datos</p>
        ) : (
          entries.map(([label, total]) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-[1.2rem] border border-white/10 bg-white/4 px-4 py-3"
            >
              <p className="text-sm">{label}</p>
              <Badge variant="secondary">{total}</Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
