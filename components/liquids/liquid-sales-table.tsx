"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Calendar,
  Droplet,
  FlaskConical,
  Search,
  Trash2,
  User,
} from "lucide-react";
import { LIQUID_VARIANT_CONFIG, LIQUID_YIELD_LITERS } from "@/lib/constants";
import { currency, formatDate } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LiquidSale } from "@/types/domain";

export function LiquidSalesTable({ sales }: { sales: LiquidSale[] }) {
  const deleteLiquidSale = useAppStore((state) => state.deleteLiquidSale);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [variantFilter, setVariantFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredSales = sales.filter((item) => {
    const matchesSearch =
      (item.customerName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (item.notes || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.flavorName || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPayment =
      paymentFilter === "all" || item.paymentMethod === paymentFilter;

    const matchesVariant =
      variantFilter === "all" || item.variant === variantFilter;

    return matchesSearch && matchesPayment && matchesVariant;
  });

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar la venta de ${name}?`)) return;
    setDeletingId(id);
    try {
      await deleteLiquidSale(id);
      toast.success("Venta de líquido eliminada");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Error al eliminar venta",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const paymentBadge = (method: string) => {
    switch (method) {
      case "cash":
        return <Badge variant="success">Efectivo</Badge>;
      case "nequi":
        return (
          <Badge variant="default" className="bg-purple-600">
            Nequi
          </Badge>
        );
      case "daviplata":
        return (
          <Badge variant="default" className="bg-red-600">
            Daviplata
          </Badge>
        );
      case "transfer":
        return <Badge variant="warning">Transferencia</Badge>;
      default:
        return <Badge variant="muted">{method}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters bar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="text-muted absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar por cliente, sabor u observaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="grid w-full grid-cols-2 gap-2 md:flex md:w-auto">
          <Select value={variantFilter} onValueChange={setVariantFilter}>
            <SelectTrigger className="w-full md:w-[170px]">
              <SelectValue placeholder="Variante" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las variantes</SelectItem>
              <SelectItem value="base_sin_licor">Base Sin Licor</SelectItem>
              <SelectItem value="base_con_licor">Base Con Licor</SelectItem>
              <SelectItem value="cremoso_sin_licor">
                Cremoso Sin Licor
              </SelectItem>
              <SelectItem value="cremoso_con_licor">
                Cremoso Con Licor
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Método Pago" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los pagos</SelectItem>
              <SelectItem value="cash">Efectivo</SelectItem>
              <SelectItem value="nequi">Nequi</SelectItem>
              <SelectItem value="daviplata">Daviplata</SelectItem>
              <SelectItem value="transfer">Transferencia</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table or Empty State */}
      {filteredSales.length === 0 ? (
        <Card className="glass-panel border-white/10 p-8 text-center">
          <CardContent className="pt-6">
            <FlaskConical className="text-muted mx-auto size-12 opacity-40" />
            <p className="mt-3 text-lg font-bold text-white">
              No se encontraron ventas de líquidos
            </p>
            <p className="text-muted mt-1 text-sm">
              {sales.length === 0
                ? "Utiliza el botón 'Nueva Venta de Líquido' para registrar la primera venta."
                : "Intenta ajustar los filtros de búsqueda."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Mobile Card List View (Visible on screens < md) */}
          <div className="space-y-3 md:hidden">
            {filteredSales.map((sale) => {
              const config = LIQUID_VARIANT_CONFIG[sale.variant];
              const variantLabel = config?.label || sale.variant;
              const totalLiters = sale.quantity * LIQUID_YIELD_LITERS;

              return (
                <div
                  key={sale.id}
                  className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/[0.08]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-sm font-bold text-white">
                          {variantLabel}
                        </span>
                        {config?.hasAlcohol && (
                          <Badge
                            variant="warning"
                            className="px-1.5 py-0 text-[10px]"
                          >
                            Licor
                          </Badge>
                        )}
                        {sale.unitPrice < (config?.price || 30000) && (
                          <Badge
                            variant="success"
                            className="px-1.5 py-0 text-[10px] font-bold"
                          >
                            🏷️ Mayorista
                          </Badge>
                        )}
                        {paymentBadge(sale.paymentMethod)}
                      </div>
                      <div className="text-muted mt-1.5 flex items-center gap-1.5 text-xs">
                        <Calendar className="size-3 shrink-0" />
                        {formatDate(sale.saleDate)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <div className="text-right">
                        <span className="font-display text-primary block text-lg font-extrabold">
                          {currency(sale.total)}
                        </span>
                        <span className="text-muted text-[11px]">
                          {currency(sale.unitPrice)} c/u
                        </span>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="ml-1 size-8 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        onClick={() => handleDelete(sale.id, variantLabel)}
                        disabled={deletingId === sale.id}
                        title="Eliminar registro"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-2 text-xs">
                    <div className="flex items-center gap-2">
                      {sale.flavorName ? (
                        <span className="border-primary/30 bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold">
                          <Droplet className="size-3" />
                          {sale.flavorName}
                        </span>
                      ) : (
                        <span className="text-muted">Sin sabor</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 font-semibold text-white">
                      <span>{sale.quantity} bot.</span>
                      <span className="text-secondary text-[11px] font-medium">
                        (~{totalLiters}L)
                      </span>
                    </div>
                  </div>

                  {(sale.customerName || sale.notes) && (
                    <div className="text-muted space-y-1 border-t border-white/5 pt-2 text-xs">
                      {sale.customerName && (
                        <div className="flex items-center gap-1 font-medium text-white/90">
                          <User className="text-muted size-3 shrink-0" />
                          {sale.customerName}
                        </div>
                      )}
                      {sale.notes && (
                        <p className="truncate text-white/70 italic">
                          {sale.notes}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop Table View (Visible on screens >= md) */}
          <div className="glass-panel hidden overflow-x-auto rounded-2xl border border-white/10 md:block">
            <table className="w-full text-left text-sm">
              <thead className="text-muted border-b border-white/10 bg-white/5 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">Fecha</th>
                  <th className="px-4 py-3 font-semibold">Variante</th>
                  <th className="px-4 py-3 font-semibold">Sabor</th>
                  <th className="px-4 py-3 text-center font-semibold">Cant.</th>
                  <th className="px-4 py-3 text-center font-semibold">
                    Rendimiento
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Unitario
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Pago</th>
                  <th className="px-4 py-3 font-semibold">Cliente / Notas</th>
                  <th className="px-4 py-3 text-center font-semibold">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSales.map((sale) => {
                  const config = LIQUID_VARIANT_CONFIG[sale.variant];
                  const variantLabel = config?.label || sale.variant;
                  const totalLiters = sale.quantity * LIQUID_YIELD_LITERS;

                  return (
                    <tr
                      key={sale.id}
                      className="transition-colors hover:bg-white/5"
                    >
                      <td className="px-4 py-3.5 font-medium whitespace-nowrap text-white">
                        <div className="flex items-center gap-2">
                          <Calendar className="text-muted size-3.5 shrink-0" />
                          {formatDate(sale.saleDate)}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-white">
                            {variantLabel}
                          </span>
                          {config?.hasAlcohol && (
                            <Badge
                              variant="warning"
                              className="px-1 py-0 text-[10px]"
                            >
                              Licor
                            </Badge>
                          )}
                          {sale.unitPrice < (config?.price || 30000) && (
                            <Badge
                              variant="success"
                              className="px-1 py-0 text-[10px] font-bold"
                            >
                              🏷️ Mayorista
                            </Badge>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {sale.flavorName ? (
                          <span className="border-primary/30 bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                            <Droplet className="size-3" />
                            {sale.flavorName}
                          </span>
                        ) : (
                          <span className="text-muted text-xs">Sin sabor</span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-center font-bold whitespace-nowrap text-white">
                        {sale.quantity} bot.
                      </td>

                      <td className="text-secondary px-4 py-3.5 text-center text-xs font-semibold whitespace-nowrap">
                        ~{totalLiters} L
                      </td>

                      <td className="text-muted px-4 py-3.5 text-right whitespace-nowrap">
                        {currency(sale.unitPrice)}
                      </td>

                      <td className="font-display text-primary px-4 py-3.5 text-right font-extrabold whitespace-nowrap">
                        {currency(sale.total)}
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {paymentBadge(sale.paymentMethod)}
                      </td>

                      <td className="text-muted max-w-[200px] truncate px-4 py-3.5 text-xs">
                        {sale.customerName && (
                          <div className="flex items-center gap-1 font-medium text-white/90">
                            <User className="text-muted size-3 shrink-0" />
                            {sale.customerName}
                          </div>
                        )}
                        {sale.notes && (
                          <p className="truncate text-white/70 italic">
                            {sale.notes}
                          </p>
                        )}
                        {!sale.customerName && !sale.notes && "-"}
                      </td>

                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                          onClick={() => handleDelete(sale.id, variantLabel)}
                          disabled={deletingId === sale.id}
                          title="Eliminar registro"
                        >
                          <Trash2 className="size-4" />
                        </Button>
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
