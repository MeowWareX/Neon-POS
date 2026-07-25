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
import {
  LIQUID_VARIANT_CONFIG,
  LIQUID_YIELD_LITERS,
} from "@/lib/constants";
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
      (item.customerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        return <Badge variant="default" className="bg-purple-600">Nequi</Badge>;
      case "daviplata":
        return <Badge variant="default" className="bg-red-600">Daviplata</Badge>;
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
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <Input
            placeholder="Buscar por cliente, sabor u observaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Select value={variantFilter} onValueChange={setVariantFilter}>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Variante" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las variantes</SelectItem>
              <SelectItem value="base_sin_licor">Base Sin Licor</SelectItem>
              <SelectItem value="base_con_licor">Base Con Licor</SelectItem>
              <SelectItem value="cremoso_sin_licor">Cremoso Sin Licor</SelectItem>
              <SelectItem value="cremoso_con_licor">Cremoso Con Licor</SelectItem>
            </SelectContent>
          </Select>

          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-[150px]">
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
            <FlaskConical className="mx-auto size-12 text-muted opacity-40" />
            <p className="mt-3 text-lg font-bold text-white">
              No se encontraron ventas de líquidos
            </p>
            <p className="mt-1 text-sm text-muted">
              {sales.length === 0
                ? "Utiliza el botón 'Nueva Venta de Líquido' para registrar la primera venta."
                : "Intenta ajustar los filtros de búsqueda."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10 glass-panel">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-white/5 text-xs text-muted uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold">Variante</th>
                <th className="px-4 py-3 font-semibold">Sabor</th>
                <th className="px-4 py-3 font-semibold text-center">Cant.</th>
                <th className="px-4 py-3 font-semibold text-center">Rendimiento</th>
                <th className="px-4 py-3 font-semibold text-right">Unitario</th>
                <th className="px-4 py-3 font-semibold text-right">Total</th>
                <th className="px-4 py-3 font-semibold">Pago</th>
                <th className="px-4 py-3 font-semibold">Cliente / Notas</th>
                <th className="px-4 py-3 font-semibold text-center">Acción</th>
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
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3.5 whitespace-nowrap font-medium text-white">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-3.5 text-muted shrink-0" />
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
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {sale.flavorName ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                          <Droplet className="size-3" />
                          {sale.flavorName}
                        </span>
                      ) : (
                        <span className="text-muted text-xs">Sin sabor</span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap text-center font-bold text-white">
                      {sale.quantity} bot.
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap text-center text-xs font-semibold text-secondary">
                      ~{totalLiters} L
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap text-right text-muted">
                      {currency(sale.unitPrice)}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap text-right font-display font-extrabold text-primary">
                      {currency(sale.total)}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {paymentBadge(sale.paymentMethod)}
                    </td>

                    <td className="px-4 py-3.5 max-w-[200px] truncate text-xs text-muted">
                      {sale.customerName && (
                        <div className="flex items-center gap-1 font-medium text-white/90">
                          <User className="size-3 text-muted shrink-0" />
                          {sale.customerName}
                        </div>
                      )}
                      {sale.notes && (
                        <p className="truncate italic text-white/70">{sale.notes}</p>
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
      )}
    </div>
  );
}
