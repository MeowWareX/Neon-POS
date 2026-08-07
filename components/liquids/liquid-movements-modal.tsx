"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { History, ArrowUpRight, ArrowDownRight, AlertTriangle, RefreshCw } from "lucide-react";
import { useAppStore } from "@/stores/app-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { LiquidMovementType } from "@/types/domain";

export function LiquidMovementsModal({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const movements = useAppStore((state) => state.liquidInventoryMovements) || [];

  const getMovementBadge = (type: LiquidMovementType, qty: number) => {
    switch (type) {
      case "production":
        return (
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 gap-1">
            <ArrowUpRight className="size-3" /> Producción (+{qty})
          </Badge>
        );
      case "sale":
        return (
          <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 gap-1">
            <ArrowDownRight className="size-3" /> Venta ({qty})
          </Badge>
        );
      case "point_use":
        return (
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 gap-1">
            <ArrowDownRight className="size-3" /> Uso en Punto ({qty})
          </Badge>
        );
      case "waste":
        return (
          <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30 gap-1">
            <AlertTriangle className="size-3" /> Merma ({qty})
          </Badge>
        );
      case "adjustment":
      default:
        return (
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 gap-1">
            <RefreshCw className="size-3" /> Ajuste ({qty > 0 ? `+${qty}` : qty})
          </Badge>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            size="sm"
            variant="ghost"
            className="w-full sm:w-auto justify-center text-muted hover:text-white hover:bg-white/10 gap-1.5 text-xs"
          >
            <History className="size-3.5" />
            Historial Movimientos
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="glass-panel border-white/20 bg-slate-950/95 text-white max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-white">
            <History className="size-5 text-primary" />
            Historial de Movimientos de Bolsas
          </DialogTitle>
          <DialogDescription className="text-muted text-xs">
            Registro auditable de entradas por producción y salidas por ventas, consumo en el punto o mermas.
          </DialogDescription>
        </DialogHeader>

        {movements.length === 0 ? (
          <div className="py-8 text-center text-muted text-sm">
            No hay movimientos de inventario registrados aún.
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 overflow-x-auto mt-2">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-muted uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Sabor</th>
                  <th className="p-3">Tipo</th>
                  <th className="p-3 text-right">Cantidad</th>
                  <th className="p-3">Notas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {movements.map((mov) => {
                  let formattedDate = "";
                  try {
                    formattedDate = format(
                      new Date(mov.createdAt),
                      "dd MMM, yyyy HH:mm",
                      { locale: es },
                    );
                  } catch {
                    formattedDate = mov.createdAt;
                  }

                  return (
                    <tr key={mov.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 text-muted whitespace-nowrap">
                        {formattedDate}
                      </td>
                      <td className="p-3 font-semibold text-white">
                        {mov.flavorName}
                      </td>
                      <td className="p-3">{getMovementBadge(mov.movementType, mov.quantity)}</td>
                      <td className={`p-3 text-right font-bold ${mov.quantity > 0 ? "text-emerald-400" : "text-amber-400"}`}>
                        {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity} bolsas
                      </td>
                      <td className="p-3 text-muted max-w-[200px] truncate">
                        {mov.notes || "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
