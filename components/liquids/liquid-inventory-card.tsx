"use client";

import { useMemo } from "react";
import { AlertCircle, CheckCircle2, Droplet, PackageCheck } from "lucide-react";
import { useAppStore } from "@/stores/app-store";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LiquidAdjustmentModal } from "./liquid-adjustment-modal";
import { LiquidMovementsModal } from "./liquid-movements-modal";
import { LiquidProductionModal } from "./liquid-production-modal";

export function LiquidInventoryCard() {
  const liquidInventory = useAppStore((state) => state.liquidInventory);

  const totalBagsInStock = useMemo(() => {
    const list = liquidInventory || [];
    return list.reduce((acc, curr) => acc + curr.currentStock, 0);
  }, [liquidInventory]);

  return (
    <Card className="glass-panel border-white/10 p-4 md:p-5 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="border-emerald-500/40 bg-emerald-500/15 text-emerald-400 flex size-9 shrink-0 items-center justify-center rounded-xl border shadow-[0_0_15px_rgba(16,185,129,0.25)]">
            <PackageCheck className="size-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-white flex flex-wrap items-center gap-2">
              <span>Stock de Bolsas Producidas</span>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs font-semibold">
                {totalBagsInStock} bolsas en total
              </Badge>
            </h2>
            <p className="text-muted text-xs truncate">
              Inventario de concentrado listo para venta o refil en máquinas
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:items-center w-full sm:w-auto">
          <LiquidProductionModal />
          <LiquidAdjustmentModal />
          <LiquidMovementsModal />
        </div>
      </div>

      {/* Stock Cards Grid */}
      {(!liquidInventory || liquidInventory.length === 0) ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-muted text-xs">
          No hay productos o sabores registrados en el stock de líquidos. Usa el botón &quot;+ Entrada Producción&quot; para ingresar las primeras bolsas.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 pt-1">
          {liquidInventory.map((item) => {
            const isLowStock = item.currentStock <= item.minStock && item.currentStock > 0;
            const isOutOfStock = item.currentStock === 0;

            return (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/[0.08]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplet className="size-4 text-cyan-400" />
                    <span className="font-bold text-white text-sm">
                      {item.flavorName}
                    </span>
                  </div>
                  {isOutOfStock ? (
                    <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30 text-[10px]">
                      Agotado
                    </Badge>
                  ) : isLowStock ? (
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px]">
                      Bajo Stock
                    </Badge>
                  ) : (
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                      Disponible
                    </Badge>
                  )}
                </div>

                <div className="mt-3 flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display text-2xl font-extrabold text-white">
                      {item.currentStock}
                    </span>
                    <span className="text-muted text-xs">bolsas</span>
                  </div>
                  {item.variant && (
                    <span className="text-[11px] text-muted truncate max-w-[120px]">
                      {item.variant.replace(/_/g, " ")}
                    </span>
                  )}
                </div>

                <div className="mt-2 text-[11px] text-muted flex items-center justify-between pt-2 border-t border-white/5">
                  <span>Mínimo deseado: {item.minStock}</span>
                  {isOutOfStock ? (
                    <AlertCircle className="size-3 text-rose-400" />
                  ) : (
                    <CheckCircle2 className="size-3 text-emerald-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
