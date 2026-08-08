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
import { LiquidInventoryCard } from "@/components/liquids/liquid-inventory-card";
import { LiquidMovementsTable } from "@/components/liquids/liquid-movements-table";
import { LiquidSaleModal } from "@/components/liquids/liquid-sale-modal";
import { LiquidSalesTable } from "@/components/liquids/liquid-sales-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LiquidSalesPage() {
  const user = useAuthStore((state) => state.user);
  const rawLiquidSales = useAppStore((state) => state.liquidSales);
  const liquidSales = rawLiquidSales || [];

  const metrics = useMemo(() => {
    const list = rawLiquidSales || [];
    const totalSales = list.reduce((acc, curr) => acc + curr.total, 0);
    const totalUnits = list.reduce((acc, curr) => acc + curr.quantity, 0);
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
        <FlaskConical className="text-muted mx-auto size-12" />
        <h2 className="mt-4 text-xl font-bold text-white">
          Acceso Restringido
        </h2>
        <p className="text-muted mt-2 text-sm">
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
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <div className="border-primary/40 bg-primary/15 text-primary flex size-10 shrink-0 items-center justify-center rounded-2xl border shadow-[0_0_20px_rgba(255,79,216,0.3)]">
              <FlaskConical className="size-5" />
            </div>
            <div className="min-w-0">
              <h1 className="font-display truncate text-xl font-bold tracking-tight text-white sm:text-2xl md:text-3xl">
                Ventas de Líquidos Concentrados
              </h1>
              <p className="text-muted truncate text-xs md:text-sm">
                Gestión comercial de insumos para máquinas granizadoras
              </p>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-auto">
          <LiquidSaleModal />
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
        <Card className="glass-panel border-white/10 p-3 sm:p-4">
          <CardHeader className="flex flex-row items-center justify-between p-0 pb-2">
            <CardTitle className="text-muted truncate text-[10px] font-semibold tracking-wider uppercase sm:text-xs">
              Ventas Totales
            </CardTitle>
            <TrendingUp className="text-primary size-3.5 shrink-0 sm:size-4" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="font-display text-primary truncate text-lg font-extrabold sm:text-2xl">
              {currency(metrics.totalSales)}
            </div>
            <p className="text-muted mt-0.5 truncate text-[10px] sm:mt-1 sm:text-xs">
              {metrics.count} registros de venta
            </p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10 p-3 sm:p-4">
          <CardHeader className="flex flex-row items-center justify-between p-0 pb-2">
            <CardTitle className="text-muted truncate text-[10px] font-semibold tracking-wider uppercase sm:text-xs">
              Botellas Vendidas
            </CardTitle>
            <PackageCheck className="text-secondary size-3.5 shrink-0 sm:size-4" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="font-display text-secondary truncate text-lg font-extrabold sm:text-2xl">
              {metrics.totalUnits}{" "}
              <span className="text-xs font-normal sm:text-sm">unid.</span>
            </div>
            <p className="text-muted mt-0.5 truncate text-[10px] sm:mt-1 sm:text-xs">
              Concentrado empacado
            </p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10 p-3 sm:p-4">
          <CardHeader className="flex flex-row items-center justify-between p-0 pb-2">
            <CardTitle className="text-muted truncate text-[10px] font-semibold tracking-wider uppercase sm:text-xs">
              Capacidad Producida
            </CardTitle>
            <Droplet className="size-3.5 shrink-0 text-cyan-400 sm:size-4" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="font-display truncate text-lg font-extrabold text-cyan-400 sm:text-2xl">
              ~{metrics.totalLiters}{" "}
              <span className="text-xs font-normal sm:text-sm">Litros</span>
            </div>
            <p className="text-muted mt-0.5 truncate text-[10px] sm:mt-1 sm:text-xs">
              Rendimiento granizado
            </p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10 p-3 sm:p-4">
          <CardHeader className="flex flex-row items-center justify-between p-0 pb-2">
            <CardTitle className="text-muted truncate text-[10px] font-semibold tracking-wider uppercase sm:text-xs">
              Desglose de Recaudo
            </CardTitle>
            <Coins className="size-3.5 shrink-0 text-emerald-400 sm:size-4" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex items-center justify-between text-[11px] sm:text-xs">
              <span className="text-muted">Efectivo:</span>
              <span className="font-bold text-emerald-400">
                {currency(metrics.cashSales)}
              </span>
            </div>
            <div className="mt-0.5 flex items-center justify-between text-[11px] sm:text-xs">
              <span className="text-muted">Digital:</span>
              <span className="font-bold text-purple-400">
                {currency(metrics.digitalSales)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Inventory Card */}
      <LiquidInventoryCard />

      {/* Main Tables with Tabs */}
      <Card className="glass-panel border-white/10 p-4 md:p-6">
        <Tabs defaultValue="sales" className="w-full space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">
                Historial de Operaciones de Líquidos
              </h2>
              <p className="text-muted text-xs">
                Consulta las ventas comerciales y el registro de insumos enviados al punto de venta.
              </p>
            </div>

            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="sales" className="gap-1.5 text-xs">
                🧾 Ventas Comerciales ({liquidSales.length})
              </TabsTrigger>
              <TabsTrigger value="movements" className="gap-1.5 text-xs">
                📦 Insumos a Punto / Movimientos
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="sales" className="mt-0">
            <LiquidSalesTable sales={liquidSales} />
          </TabsContent>

          <TabsContent value="movements" className="mt-0">
            <LiquidMovementsTable />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
