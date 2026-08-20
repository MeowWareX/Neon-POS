"use client";

import { useEffect, useState } from "react";
import { Download, Users, Sparkles, Gift, Repeat } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { compactNumber, formatDate } from "@/lib/utils";

interface LoyaltyMetrics {
  totals: {
    totalCustomers: number;
    stampsIssued: number;
    rewardsRedeemed: number;
    recurringCustomers: number;
  };
  walletBreakdown: Record<string, number>;
  topCustomers: Array<{
    id: string;
    fullName: string;
    phone: string;
    stampsCount: number;
    totalRewardsClaimed: number;
    createdAt: string;
  }>;
}

interface CustomerHistory {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  currentStamps: number;
  totalRewardsClaimed: number;
  lifetimeStamps: number;
  orders: number;
  lastActivity: string | null;
  createdAt: string;
}

export function LoyaltyOverview() {
  const [metrics, setMetrics] = useState<LoyaltyMetrics | null>(null);
  const [customers, setCustomers] = useState<CustomerHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    try {
      setIsLoading(true);
      const [metricsRes, customersRes] = await Promise.all([
        fetch("/api/loyalty/metrics", { cache: "no-store" }),
        fetch("/api/loyalty/customers", { cache: "no-store" }),
      ]);

      if (!metricsRes.ok || !customersRes.ok) {
        throw new Error("Failed to load loyalty data");
      }

      const [metricsData, customersData] = await Promise.all([
        metricsRes.json(),
        customersRes.json(),
      ]);

      setMetrics(metricsData);
      setCustomers(customersData.customers ?? []);
    } catch (error) {
      console.error("Error loading loyalty overview:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const exportCsv = () => {
    const header = [
      "Nombre",
      "Teléfono",
      "Email",
      "Sellos actuales",
      "Premios redimidos",
      "Sellos de por vida",
      "Pedidos",
      "Última actividad",
      "Registro",
    ];

    const rows = customers.map((customer) => [
      customer.fullName,
      customer.phone,
      customer.email ?? "",
      String(customer.currentStamps),
      String(customer.totalRewardsClaimed),
      String(customer.lifetimeStamps),
      String(customer.orders),
      customer.lastActivity ? formatDate(customer.lastActivity) : "",
      formatDate(customer.createdAt),
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `neon-loyalty-customers-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading && !metrics) {
    return (
      <div className="text-muted py-8 text-center">
        Cargando métricas de fidelización...
      </div>
    );
  }

  if (!metrics || metrics.totals.totalCustomers === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Sin clientes todavía"
        description="Cuando los clientes se registren en NEON Club verás métricas de fidelización, sellos y premios."
      />
    );
  }

  const totals = metrics.totals;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Clientes totales"
          value={compactNumber(totals.totalCustomers)}
          hint="Miembros de NEON Club"
        />
        <KpiCard
          label="Sellos emitidos"
          value={compactNumber(totals.stampsIssued)}
          hint="Sellos acumulados en compras"
        />
        <KpiCard
          label="Premios redimidos"
          value={compactNumber(totals.rewardsRedeemed)}
          hint="Raspados gratis entregados"
        />
        <KpiCard
          label="Clientes recurrentes"
          value={compactNumber(totals.recurringCustomers)}
          hint="Más de 1 pedido registrado"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Pases por billetera</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(metrics.walletBreakdown).length === 0 ? (
              <p className="text-muted text-sm">No hay pases emitidos</p>
            ) : (
              Object.entries(metrics.walletBreakdown).map(
                ([wallet, count]) => (
                  <div
                    key={wallet}
                    className="flex items-center justify-between rounded-[1.2rem] border border-white/10 bg-white/4 px-4 py-3"
                  >
                    <Badge variant="muted">{wallet}</Badge>
                    <p className="font-semibold">{compactNumber(count)}</p>
                  </div>
                ),
              )
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top clientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {metrics.topCustomers.map((customer, index) => (
              <div
                key={customer.id}
                className="flex items-center justify-between gap-3 rounded-[1.2rem] border border-white/10 bg-white/4 px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="text-muted w-5 text-sm font-semibold">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {customer.fullName}
                    </p>
                    <p className="text-muted font-mono text-xs">
                      {customer.phone}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant="secondary">
                    <Sparkles className="mr-1 size-3" />
                    {customer.stampsCount}/10
                  </Badge>
                  <Badge variant="success">
                    <Gift className="mr-1 size-3" />
                    {customer.totalRewardsClaimed}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Historial de clientes</CardTitle>
            <p className="text-muted mt-1 text-sm">
              Visualiza y exporta el historial completo de fidelización.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={exportCsv}>
            <Download className="mr-2 size-4" />
            Exportar CSV
          </Button>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-muted border-b border-white/10 text-xs uppercase tracking-wider">
                <th className="px-3 py-2 font-semibold">Cliente</th>
                <th className="px-3 py-2 font-semibold">Teléfono</th>
                <th className="px-3 py-2 text-right font-semibold">Sellos</th>
                <th className="px-3 py-2 text-right font-semibold">Premios</th>
                <th className="px-3 py-2 text-right font-semibold">Pedidos</th>
                <th className="px-3 py-2 text-right font-semibold">Última actividad</th>
              </tr>
            </thead>
            <tbody>
              {customers.slice(0, 50).map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-white/5 transition-colors hover:bg-white/4"
                >
                  <td className="px-3 py-2.5 font-medium">{customer.fullName}</td>
                  <td className="text-muted px-3 py-2.5 font-mono text-xs">
                    {customer.phone}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <Badge variant="secondary">
                      <Sparkles className="mr-1 size-3" />
                      {customer.currentStamps}/10
                    </Badge>
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <Badge variant="success">
                      <Gift className="mr-1 size-3" />
                      {customer.totalRewardsClaimed}
                    </Badge>
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <Badge variant="muted">
                      <Repeat className="mr-1 size-3" />
                      {customer.orders}
                    </Badge>
                  </td>
                  <td className="text-muted px-3 py-2.5 text-right text-xs">
                    {customer.lastActivity
                      ? formatDate(customer.lastActivity)
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {customers.length === 0 && (
            <p className="text-muted py-6 text-center text-sm">
              No hay clientes registrados.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
