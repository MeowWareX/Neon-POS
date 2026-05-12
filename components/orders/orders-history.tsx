"use client";

import { Search, WifiOff } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { currency, formatDateTime } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";
import type {
  Extra,
  Flavor,
  OrderItem,
  ProductSize,
  ProductType,
} from "@/types/domain";

const paymentLabel: Record<string, string> = {
  cash: "Efectivo",
  nequi: "Nequi",
};

function summarizeOrderItem(
  item: OrderItem,
  catalog: {
    sizes: ProductSize[];
    productTypes: ProductType[];
    flavors: Flavor[];
    extras: Extra[];
  },
) {
  const size = catalog.sizes.find((entry) => entry.id === item.sizeId);
  const productType = catalog.productTypes.find(
    (entry) => entry.id === item.typeId,
  );
  const flavor = catalog.flavors.find((entry) => entry.id === item.flavorId);
  const extras = item.extraIds
    .map((extraId) => catalog.extras.find((entry) => entry.id === extraId))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  return {
    sizeLabel: size?.label ?? "Tamaño",
    typeLabel: productType?.label ?? "Producto",
    flavorLabel: flavor?.name ?? "Sabor",
    extras,
  };
}

export function OrdersHistory() {
  const { orders, sizes, productTypes, flavors, extras } = useAppStore(
    useShallow((state) => ({
      orders: state.orders,
      sizes: state.sizes,
      productTypes: state.productTypes,
      flavors: state.flavors,
      extras: state.extras,
    })),
  );
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const filteredOrders = useMemo(() => {
    const query = deferredSearch.toLowerCase().trim();

    return orders.filter((order) => {
      if (!query) {
        return true;
      }

      return (
        order.orderNumber.toLowerCase().includes(query) ||
        order.paymentMethod.toLowerCase().includes(query)
      );
    });
  }, [deferredSearch, orders]);

  return (
    <div className="space-y-4">
      <Card className="sticky top-20 z-20">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="text-muted absolute top-1/2 left-4 size-4 -translate-y-1/2" />
            <Input
              className="h-11 pl-10"
              placeholder="Buscar por número o método de pago"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={WifiOff}
          title="No hay pedidos"
          description="Todavía no existen pedidos que coincidan con tu búsqueda."
        />
      ) : (
        <div className="grid gap-3">
          {filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-base font-semibold">
                        {order.orderNumber}
                      </p>
                      <Badge
                        variant={
                          order.syncState === "synced" ? "success" : "warning"
                        }
                      >
                        {order.syncState}
                      </Badge>
                    </div>
                    <p className="text-muted mt-1 text-xs">
                      {formatDateTime(order.createdAt)}
                    </p>
                    <div className="text-muted mt-2 flex items-center gap-2 text-xs">
                      <Badge variant="muted">{order.items.length} prod.</Badge>
                      <Badge variant="muted">
                        {paymentLabel[order.paymentMethod] ??
                          order.paymentMethod}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-foreground text-lg font-semibold">
                      {currency(order.total)}
                    </p>
                  </div>
                </div>

                <details className="mt-4 rounded-3xl border border-white/10 bg-black/12 p-3">
                  <summary className="cursor-pointer list-none">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">
                          Ver detalle de productos
                        </p>
                        <p className="text-muted text-xs">
                          {order.items.length} línea(s) con tamaños, sabores y
                          extras
                        </p>
                      </div>
                      <Badge variant="muted">Detalle</Badge>
                    </div>
                  </summary>

                  <div className="mt-3 space-y-2">
                    {order.items.map((item) => {
                      const summary = summarizeOrderItem(item, {
                        sizes,
                        productTypes,
                        flavors,
                        extras,
                      });

                      return (
                        <div
                          key={item.id}
                          className="rounded-2xl border border-white/10 bg-white/4 p-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold">
                                {item.quantity}x {summary.sizeLabel}{" "}
                                {summary.typeLabel}
                              </p>
                              <p className="text-muted text-xs">
                                {summary.flavorLabel}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold">
                                {currency(item.lineTotal)}
                              </p>
                              <p className="text-muted text-[0.7rem]">
                                {currency(item.unitPrice)} c/u
                              </p>
                            </div>
                          </div>

                          <div className="mt-2 flex flex-wrap gap-2">
                            {summary.extras.length > 0 ? (
                              summary.extras.map((extra) => (
                                <Badge key={extra.id} variant="muted">
                                  {extra.name}
                                </Badge>
                              ))
                            ) : (
                              <Badge variant="muted">Sin extras</Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </details>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
