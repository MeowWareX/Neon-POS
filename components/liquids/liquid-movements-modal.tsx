"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  History,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
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

export function LiquidMovementsModal({
  trigger,
}: {
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const movements =
    useAppStore((state) => state.liquidInventoryMovements) || [];

  const getMovementBadge = (type: LiquidMovementType, qty: number) => {
    switch (type) {
      case "production":
        return (
          <Badge className="gap-1 border-emerald-500/30 bg-emerald-500/20 text-emerald-300">
            <ArrowUpRight className="size-3" /> Producción (+{qty})
          </Badge>
        );
      case "sale":
        return (
          <Badge className="gap-1 border-cyan-500/30 bg-cyan-500/20 text-cyan-300">
            <ArrowDownRight className="size-3" /> Venta ({qty})
          </Badge>
        );
      case "point_use":
        return (
          <Badge className="gap-1 border-amber-500/30 bg-amber-500/20 text-amber-300">
            <ArrowDownRight className="size-3" /> Uso en Punto ({qty})
          </Badge>
        );
      case "waste":
        return (
          <Badge className="gap-1 border-rose-500/30 bg-rose-500/20 text-rose-300">
            <AlertTriangle className="size-3" /> Merma ({qty})
          </Badge>
        );
      case "adjustment":
      default:
        return (
          <Badge className="gap-1 border-blue-500/30 bg-blue-500/20 text-blue-300">
            <RefreshCw className="size-3" /> Ajuste ({qty > 0 ? `+${qty}` : qty}
            )
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
            className="text-muted w-full justify-center gap-1.5 text-xs hover:bg-white/10 hover:text-white sm:w-auto"
          >
            <History className="size-3.5" />
            Historial Movimientos
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="glass-panel max-h-[85vh] max-w-2xl overflow-y-auto border-white/20 bg-slate-950/95 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-white">
            <History className="text-primary size-5" />
            Historial de Movimientos de Bolsas
          </DialogTitle>
          <DialogDescription className="text-muted text-xs">
            Registro auditable de entradas por producción y salidas por ventas,
            consumo en el punto o mermas.
          </DialogDescription>
        </DialogHeader>

        {movements.length === 0 ? (
          <div className="text-muted py-8 text-center text-sm">
            No hay movimientos de inventario registrados aún.
          </div>
        ) : (
          <div className="mt-2 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="text-muted border-b border-white/10 bg-white/5 font-semibold tracking-wider uppercase">
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
                    <tr
                      key={mov.id}
                      className="transition-colors hover:bg-white/5"
                    >
                      <td className="text-muted p-3 whitespace-nowrap">
                        {formattedDate}
                      </td>
                      <td className="p-3 font-semibold text-white">
                        {mov.flavorName}
                      </td>
                      <td className="p-3">
                        {getMovementBadge(mov.movementType, mov.quantity)}
                      </td>
                      <td
                        className={`p-3 text-right font-bold ${mov.quantity > 0 ? "text-emerald-400" : "text-amber-400"}`}
                      >
                        {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity}{" "}
                        bolsas
                      </td>
                      <td className="text-muted max-w-[200px] truncate p-3">
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
