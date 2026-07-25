"use client";

import { useMemo } from "react";
import {
  Coins,
  Droplet,
  FlaskConical,
  PackageCheck,
  TrendingUp,
} from "lucide-react";
import { LIQUID_YIELD_LITERS } from "@/lib/constants";
import { currency } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useAppStore } from "@/stores/app-store";
import { LiquidSaleModal } from "@/components/liquids/liquid-sale-modal";
import { LiquidSalesTable } from "@/components/liquids/liquid-sales-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LiquidSalesPage() {
  const user = useAuthStore((state) => state.user);
  const rawLiquidSales = useAppStore((state) => state.liquidSales);
  const liquidSales = rawLiquidSales || [];

  const metrics = useMemo(() => {
    const list = rawLiquidSales || [];
    const totalSales = list.reduce((acc, curr) => acc + curr.total, 0);
    const totalUnits = list.reduce(
      (acc, curr) => acc + curr.quantity,
      0,
    );
    const totalLiters = totalUnits * LIQUID_YIELD_LITERS;

    const cashSales = list
      .filter((s) => s.paymentMethod === "cash")
      .reduce((acc, curr) => acc + curr.total, 0);

    const digitalSales = totalSales - cashSales;

    return {
      totalSales,
      totalUnits,
      totalLiters,
      cashSales,
      digitalSales,
      count: list.length,
    };
  }, [rawLiquidSales]);

  if (user && user.role !== "admin") {
    return (
      <div className="glass-panel rounded-3xl border border-white/10 p-8 text-center">
        <FlaskConical className="mx-auto size-12 text-muted" />
        <h2 className="mt-4 text-xl font-bold text-white">Acceso Restringido</h2>
        <p className="mt-2 text-sm text-muted">
          Este módulo está reservado exclusivamente para administradores del
          sistema.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-2xl border border-primary/40 bg-primary/15 text-primary shadow-[0_0_20px_rgba(255,79,216,0.3)]">
              <FlaskConical className="size-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
                Ventas de Líquidos Concentrados
              </h1>
              <p className="text-xs text-muted md:text-sm">
                Gestión comercial de insumos para máquinas granizadoras
                (Rendimiento hasta 6L/unidad)
              </p>
            </div>
          </div>
        </div>

        <LiquidSaleModal />
      </div>

      {/* Summary KPA Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-panel border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted uppercase tracking-wider">
              Ventas Totales
            </CardTitle>
            <TrendingUp className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="font-display text-2xl font-extrabold text-primary">
              {currency(metrics.totalSales)}
            </div>
            <p className="mt-1 text-xs text-muted">
              {metrics.count} registros de venta
            </p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted uppercase tracking-wider">
              Botellas Vendidas
            </CardTitle>
            <PackageCheck className="size-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="font-display text-2xl font-extrabold text-secondary">
              {metrics.totalUnits} <span className="text-sm font-normal">unid.</span>
            </div>
            <p className="mt-1 text-xs text-muted">Concentrado empacado</p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted uppercase tracking-wider">
              Capacidad Producida
            </CardTitle>
            <Droplet className="size-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="font-display text-2xl font-extrabold text-cyan-400">
              ~{metrics.totalLiters} <span className="text-sm font-normal">Litros</span>
            </div>
            <p className="mt-1 text-xs text-muted">Rendimiento granizado (6L x unit)</p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted uppercase tracking-wider">
              Desglose de Recaudo
            </CardTitle>
            <Coins className="size-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Efectivo:</span>
              <span className="font-bold text-emerald-400">
                {currency(metrics.cashSales)}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-muted">Digital (Nequi/Transf):</span>
              <span className="font-bold text-purple-400">
                {currency(metrics.digitalSales)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="glass-panel border-white/10 p-4 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Historial de Ventas de Líquidos</h2>
            <p className="text-xs text-muted">
              Registro independiente de salidas comerciales de insumos concentrados
            </p>
          </div>
        </div>

        <LiquidSalesTable sales={liquidSales} />
      </Card>
    </div>
  );
}
