"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Droplet,
  History,
  RefreshCw,
  Search,
} from "lucide-react";
import { useAppStore } from "@/stores/app-store";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { LiquidMovementType } from "@/types/domain";

export function LiquidMovementsTable() {
  const liquidInventoryMovements = useAppStore(
    (state) => state.liquidInventoryMovements,
  );
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const filteredMovements = useMemo(() => {
    const list = liquidInventoryMovements || [];
    return list.filter((mov) => {
      const matchesSearch =
        !search ||
        mov.flavorName.toLowerCase().includes(search.toLowerCase()) ||
        (mov.notes && mov.notes.toLowerCase().includes(search.toLowerCase()));

      const matchesType =
        filterType === "all" || mov.movementType === filterType;

      return matchesSearch && matchesType;
    });
  }, [liquidInventoryMovements, search, filterType]);

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
            <RefreshCw className="size-3" /> Ajuste ({qty > 0 ? `+${qty}` : qty})
          </Badge>
        );
    }
  };

  const allMovements = liquidInventoryMovements || [];

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="text-muted absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar por sabor u observaciones..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white/5 border-white/10"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
              filterType === "all"
                ? "bg-primary text-black border-primary"
                : "bg-white/5 text-muted border-white/10 hover:text-white"
            }`}
          >
            Todos ({allMovements.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("point_use")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
              filterType === "point_use"
                ? "bg-amber-500/30 text-amber-300 border-amber-500/50"
                : "bg-white/5 text-muted border-white/10 hover:text-white"
            }`}
          >
            🥤 Uso en Punto ({allMovements.filter((m) => m.movementType === "point_use").length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("production")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
              filterType === "production"
                ? "bg-emerald-500/30 text-emerald-300 border-emerald-500/50"
                : "bg-white/5 text-muted border-white/10 hover:text-white"
            }`}
          >
            📦 Producción ({allMovements.filter((m) => m.movementType === "production").length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("sale")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
              filterType === "sale"
                ? "bg-cyan-500/30 text-cyan-300 border-cyan-500/50"
                : "bg-white/5 text-muted border-white/10 hover:text-white"
            }`}
          >
            💸 Ventas ({allMovements.filter((m) => m.movementType === "sale").length})
          </button>
        </div>
      </div>

      {filteredMovements.length === 0 ? (
        <Card className="glass-panel border-white/10 p-8 text-center">
          <CardContent className="pt-6">
            <History className="text-muted mx-auto size-12 opacity-40" />
            <p className="mt-3 text-lg font-bold text-white">
              No hay movimientos de inventario que coincidan
            </p>
            <p className="text-muted mt-1 text-sm">
              Prueba cambiando el término de búsqueda o el filtro seleccionado.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Mobile View (< md) */}
          <div className="space-y-3 md:hidden">
            {filteredMovements.map((mov) => {
              let formattedDate = "";
              try {
                formattedDate = format(new Date(mov.createdAt), "dd MMM, yyyy HH:mm", {
                  locale: es,
                });
              } catch {
                formattedDate = mov.createdAt;
              }

              return (
                <div
                  key={mov.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2.5 transition-all hover:bg-white/[0.08]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-white text-sm block">
                        {mov.flavorName}
                      </span>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-muted">
                        <Calendar className="size-3 shrink-0" />
                        {formattedDate}
                      </div>
                    </div>
                    <div>{getMovementBadge(mov.movementType, mov.quantity)}</div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                    <span className="text-muted truncate max-w-[220px]">
                      {mov.notes || "Sin observaciones"}
                    </span>
                    <span
                      className={`font-bold ${
                        mov.quantity > 0 ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity} bolsa(s)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View (>= md) */}
          <div className="hidden md:block glass-panel overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="text-muted border-b border-white/10 bg-white/5 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">Fecha y Hora</th>
                  <th className="px-4 py-3 font-semibold">Sabor</th>
                  <th className="px-4 py-3 font-semibold">Tipo de Movimiento</th>
                  <th className="px-4 py-3 text-right font-semibold">Cantidad</th>
                  <th className="px-4 py-3 font-semibold">Notas / Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredMovements.map((mov) => {
                  let formattedDate = "";
                  try {
                    formattedDate = format(new Date(mov.createdAt), "dd MMM, yyyy HH:mm", {
                      locale: es,
                    });
                  } catch {
                    formattedDate = mov.createdAt;
                  }

                  return (
                    <tr key={mov.id} className="transition-colors hover:bg-white/5">
                      <td className="px-4 py-3.5 whitespace-nowrap text-muted text-xs">
                        <div className="flex items-center gap-2">
                          <Calendar className="size-3.5 shrink-0 text-muted" />
                          {formattedDate}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap font-bold text-white">
                        <span className="inline-flex items-center gap-1.5">
                          <Droplet className="size-3.5 text-primary" />
                          {mov.flavorName}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {getMovementBadge(mov.movementType, mov.quantity)}
                      </td>
                      <td
                        className={`px-4 py-3.5 text-right font-extrabold whitespace-nowrap ${
                          mov.quantity > 0 ? "text-emerald-400" : "text-amber-400"
                        }`}
                      >
                        {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity} bolsa(s)
                      </td>
                      <td className="px-4 py-3.5 text-muted text-xs max-w-[280px] truncate">
                        {mov.notes || "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
