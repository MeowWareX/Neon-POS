"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock,
  Droplet,
  FlaskConical,
  Package,
  Receipt,
  Search,
  Trash2,
  User,
} from "lucide-react";
import { LIQUID_VARIANT_CONFIG, LIQUID_YIELD_LITERS } from "@/lib/constants";
import { currency, formatDate, formatTime } from "@/lib/utils";
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
import type { GroupedLiquidSale, LiquidSale } from "@/types/domain";

export function LiquidSalesTable({ sales }: { sales: LiquidSale[] }) {
  const deleteLiquidSale = useAppStore((state) => state.deleteLiquidSale);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [variantFilter, setVariantFilter] = useState("all");
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Group sales together if they belong to the same checkout batch
  const groupedSales = useMemo(() => {
    // 1. Sort strictly by timestamp descending (newest first)
    const sorted = [...sales].sort((a, b) => {
      const timeA = new Date(a.createdAt || a.saleDate).getTime();
      const timeB = new Date(b.createdAt || b.saleDate).getTime();
      return timeB - timeA;
    });

    const groups: GroupedLiquidSale[] = [];
    const groupMap = new Map<string, GroupedLiquidSale>();

    for (const sale of sorted) {
      // Use explicit groupId if available, or cluster by customer + payment + 10s time window
      let key = sale.groupId;
      if (!key) {
        const timeBucket = Math.floor(
          new Date(sale.createdAt || sale.saleDate).getTime() / 10000,
        );
        key = `${sale.saleDate}_${sale.paymentMethod}_${(sale.customerName || "").trim().toLowerCase()}_${timeBucket}`;
      }

      let group = groupMap.get(key);
      if (!group) {
        group = {
          groupId: key,
          saleDate: sale.saleDate,
          createdAt: sale.createdAt || sale.saleDate,
          customerName: sale.customerName || null,
          paymentMethod: sale.paymentMethod,
          notes: sale.notes || null,
          items: [],
          totalQuantity: 0,
          totalAmount: 0,
          syncState: sale.syncState,
        };
        groupMap.set(key, group);
        groups.push(group);
      }

      group.items.push(sale);
      group.totalQuantity += sale.quantity;
      group.totalAmount += sale.total;
      if (sale.syncState === "pending") group.syncState = "pending";
    }

    return groups;
  }, [sales]);

  // Filter grouped sales based on user search and dropdown filters
  const filteredGroups = useMemo(() => {
    return groupedSales.filter((group) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        (group.customerName || "").toLowerCase().includes(searchLower) ||
        (group.notes || "").toLowerCase().includes(searchLower) ||
        group.items.some(
          (item) =>
            (item.flavorName || "").toLowerCase().includes(searchLower) ||
            (LIQUID_VARIANT_CONFIG[item.variant]?.label || "")
              .toLowerCase()
              .includes(searchLower),
        );

      const matchesPayment =
        paymentFilter === "all" || group.paymentMethod === paymentFilter;

      const matchesVariant =
        variantFilter === "all" ||
        group.items.some((item) => item.variant === variantFilter);

      return matchesSearch && matchesPayment && matchesVariant;
    });
  }, [groupedSales, searchTerm, paymentFilter, variantFilter]);

  const handleDeleteGroup = async (group: GroupedLiquidSale) => {
    const desc = group.customerName
      ? `de ${group.customerName}`
      : `por ${currency(group.totalAmount)}`;

    if (
      !confirm(
        `¿Eliminar la venta completa ${desc} (${group.totalQuantity} botellas)? Se restituirá el inventario de cada producto.`,
      )
    ) {
      return;
    }

    setDeletingGroupId(group.groupId);
    try {
      for (const item of group.items) {
        await deleteLiquidSale(item.id);
      }
      toast.success("Venta eliminada y stock restituido");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Error al eliminar venta",
      );
    } finally {
      setDeletingGroupId(null);
    }
  };

  const handleDeleteItem = async (itemId: string, flavorName: string) => {
    if (!confirm(`¿Eliminar ${flavorName} de esta venta?`)) return;
    setDeletingItemId(itemId);
    try {
      await deleteLiquidSale(itemId);
      toast.success("Producto eliminado de la venta");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Error al eliminar producto",
      );
    } finally {
      setDeletingItemId(null);
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
            placeholder="Buscar por cliente, sabor o nota..."
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
      {filteredGroups.length === 0 ? (
        <Card className="glass-panel border-white/10 p-8 text-center">
          <CardContent className="pt-6">
            <FlaskConical className="text-muted mx-auto size-12 opacity-40" />
            <p className="mt-3 text-lg font-bold text-white">
              No se encontraron ventas de líquidos
            </p>
            <p className="text-muted mt-1 text-sm">
              {sales.length === 0
                ? "Utiliza el botón '+ Registrar Venta' para crear la primera venta."
                : "Intenta ajustar los filtros o el término de búsqueda."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredGroups.map((group) => {
            const isExpanded = expandedGroups[group.groupId] ?? false;
            const totalLiters = group.totalQuantity * LIQUID_YIELD_LITERS;
            const hasMultipleItems = group.items.length > 1;

            return (
              <div
                key={group.groupId}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all hover:border-white/20"
              >
                {/* Main Header / Group Summary Row */}
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    {/* Left: Date, Customer, Payment */}
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-white/90">
                          <Calendar className="text-primary size-3.5 shrink-0" />
                          <span>{formatDate(group.saleDate)}</span>
                          <span className="text-white/40">•</span>
                          <Clock className="text-muted size-3.5 shrink-0" />
                          <span className="text-muted font-normal">
                            {formatTime(group.createdAt)}
                          </span>
                        </div>

                        {paymentBadge(group.paymentMethod)}

                        {hasMultipleItems && (
                          <Badge
                            variant="default"
                            className="bg-primary/20 text-primary border-primary/30 text-[11px]"
                          >
                            <Package className="mr-1 size-3" />
                            {group.items.length} productos
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {group.customerName ? (
                          <span className="flex items-center gap-1 text-sm font-bold text-white">
                            <User className="text-muted size-3.5" />
                            {group.customerName}
                          </span>
                        ) : (
                          <span className="text-muted text-xs italic">
                            Venta de mostrador
                          </span>
                        )}

                        {group.notes && (
                          <span className="text-muted max-w-[300px] truncate text-xs">
                            • {group.notes}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Quantity, Total & Actions */}
                    <div className="flex items-center justify-between gap-3 border-t border-white/5 pt-2 sm:border-0 sm:pt-0">
                      <div className="text-left sm:text-right">
                        <div className="font-display text-primary text-xl font-extrabold sm:text-2xl">
                          {currency(group.totalAmount)}
                        </div>
                        <div className="text-muted flex items-center gap-1 text-xs sm:justify-end">
                          <span className="font-semibold text-white">
                            {group.totalQuantity} bot.
                          </span>
                          <span className="text-secondary font-medium">
                            (~{totalLiters}L)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {hasMultipleItems && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 gap-1 border-white/10 bg-white/5 px-2.5 text-xs text-white hover:bg-white/10"
                            onClick={() => toggleGroup(group.groupId)}
                          >
                            {isExpanded ? (
                              <>
                                <ChevronDown className="size-3.5" />
                                Ocultar
                              </>
                            ) : (
                              <>
                                <ChevronRight className="size-3.5" />
                                Ver detalle
                              </>
                            )}
                          </Button>
                        )}

                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                          onClick={() => handleDeleteGroup(group)}
                          disabled={deletingGroupId === group.groupId}
                          title="Eliminar venta completa"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Flavor Chips Preview (Always visible for quick glance) */}
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-white/5 pt-2.5">
                    {group.items.map((item) => {
                      const cfg = LIQUID_VARIANT_CONFIG[item.variant];
                      return (
                        <span
                          key={item.id}
                          className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/90"
                        >
                          <Droplet className="text-primary size-3" />
                          <span className="font-bold">{item.quantity}x</span>
                          <span>{item.flavorName || "Sin sabor"}</span>
                          <span className="text-muted text-[10px]">
                            ({cfg?.label || item.variant})
                          </span>
                          <span className="text-primary/90 ml-1 font-semibold">
                            {currency(item.total)}
                          </span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Expanded Multi-Item Breakdown Table */}
                {hasMultipleItems && isExpanded && (
                  <div className="border-t border-white/10 bg-black/30 p-3 sm:p-4">
                    <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-white/80">
                      <Receipt className="size-3.5" />
                      <span>Desglose de productos en esta venta:</span>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-white/10">
                      <table className="w-full text-left text-xs">
                        <thead className="text-muted border-b border-white/10 bg-white/5 font-semibold uppercase">
                          <tr>
                            <th className="px-3 py-2">Variante</th>
                            <th className="px-3 py-2">Sabor</th>
                            <th className="px-3 py-2 text-center">Cant.</th>
                            <th className="px-3 py-2 text-right">Unitario</th>
                            <th className="px-3 py-2 text-right">Subtotal</th>
                            <th className="px-3 py-2 text-center">Acción</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {group.items.map((item) => {
                            const cfg = LIQUID_VARIANT_CONFIG[item.variant];
                            const isWholesale =
                              item.unitPrice < (cfg?.price || 30000);

                            return (
                              <tr
                                key={item.id}
                                className="transition-colors hover:bg-white/5"
                              >
                                <td className="px-3 py-2.5 font-medium whitespace-nowrap text-white">
                                  <div className="flex items-center gap-1.5">
                                    <span>{cfg?.label || item.variant}</span>
                                    {cfg?.hasAlcohol && (
                                      <Badge
                                        variant="warning"
                                        className="px-1 py-0 text-[9px]"
                                      >
                                        Licor
                                      </Badge>
                                    )}
                                  </div>
                                </td>
                                <td className="px-3 py-2.5 whitespace-nowrap">
                                  <span className="font-semibold text-white">
                                    {item.flavorName || "Sin sabor"}
                                  </span>
                                </td>
                                <td className="px-3 py-2.5 text-center font-bold text-white">
                                  {item.quantity} bot.
                                </td>
                                <td className="text-muted px-3 py-2.5 text-right whitespace-nowrap">
                                  {currency(item.unitPrice)}
                                  {isWholesale && (
                                    <span className="ml-1 text-[9px] text-emerald-400">
                                      (Mayor)
                                    </span>
                                  )}
                                </td>
                                <td className="text-primary px-3 py-2.5 text-right font-bold whitespace-nowrap">
                                  {currency(item.total)}
                                </td>
                                <td className="px-3 py-2.5 text-center">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="size-6 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                    onClick={() =>
                                      handleDeleteItem(
                                        item.id,
                                        item.flavorName || "este producto",
                                      )
                                    }
                                    disabled={deletingItemId === item.id}
                                    title="Eliminar este ítem"
                                  >
                                    <Trash2 className="size-3.5" />
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
