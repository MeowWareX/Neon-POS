"use client";

import { Search, WifiOff } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { currency, formatDateTime } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";

export function OrdersHistory() {
  const orders = useAppStore((state) => state.orders);
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
    <div className="space-y-5">
      <Card>
        <CardContent className="p-5">
          <div className="relative">
            <Search className="text-muted absolute top-1/2 left-4 size-4 -translate-y-1/2" />
            <Input
              className="pl-10"
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
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold">
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
                    <p className="text-muted mt-2 text-sm">
                      {formatDateTime(order.createdAt)}
                    </p>
                  </div>

                  <div className="text-muted grid gap-1 text-sm md:text-right">
                    <p>{order.items.length} productos</p>
                    <p>{order.paymentMethod}</p>
                    <p className="text-foreground text-lg font-semibold">
                      {currency(order.total)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
