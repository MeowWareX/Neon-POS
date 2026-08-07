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
    <Card className="glass-panel space-y-4 border-white/10 p-4 md:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/15 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
            <PackageCheck className="size-5" />
          </div>
          <div className="min-w-0">
            <h2 className="flex flex-wrap items-center gap-2 text-sm font-bold text-white sm:text-base">
              <span>Stock de Bolsas Producidas</span>
              <Badge className="border-emerald-500/30 bg-emerald-500/20 text-xs font-semibold text-emerald-300">
                {totalBagsInStock} bolsas en total
              </Badge>
            </h2>
            <p className="text-muted truncate text-xs">
              Inventario de concentrado listo para venta o refil en máquinas
            </p>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
          <LiquidProductionModal />
          <LiquidAdjustmentModal />
          <LiquidMovementsModal />
        </div>
      </div>

      {/* Stock Cards Grid */}
      {!liquidInventory || liquidInventory.length === 0 ? (
        <div className="text-muted rounded-2xl border border-dashed border-white/10 p-6 text-center text-xs">
          No hay productos o sabores registrados en el stock de líquidos. Usa el
          botón &quot;+ Entrada Producción&quot; para ingresar las primeras
          bolsas.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 pt-1 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
          {liquidInventory.map((item) => {
            const isLowStock =
              item.currentStock <= item.minStock && item.currentStock > 0;
            const isOutOfStock = item.currentStock === 0;

            return (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/[0.08]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplet className="size-4 text-cyan-400" />
                    <span className="text-sm font-bold text-white">
                      {item.flavorName}
                    </span>
                  </div>
                  {isOutOfStock ? (
                    <Badge className="border-rose-500/30 bg-rose-500/20 text-[10px] text-rose-300">
                      Agotado
                    </Badge>
                  ) : isLowStock ? (
                    <Badge className="border-amber-500/30 bg-amber-500/20 text-[10px] text-amber-300">
                      Bajo Stock
                    </Badge>
                  ) : (
                    <Badge className="border-emerald-500/30 bg-emerald-500/20 text-[10px] text-emerald-300">
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
                    <span className="text-muted max-w-[120px] truncate text-[11px]">
                      {item.variant.replace(/_/g, " ")}
                    </span>
                  )}
                </div>

                <div className="text-muted mt-2 flex items-center justify-between border-t border-white/5 pt-2 text-[11px]">
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
