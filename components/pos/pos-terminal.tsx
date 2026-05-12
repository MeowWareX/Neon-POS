"use client";

import { Plus, ReceiptText, ShoppingBag, Trash2 } from "lucide-react";
import { startTransition, useMemo, useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { calculateOrderItem, createOrderRecord } from "@/lib/business";
import { currency, formatTime } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";
import type { OrderItem, OrderItemDraft, PaymentMethod } from "@/types/domain";

const paymentLabels: Record<PaymentMethod, string> = {
  cash: "Efectivo",
  nequi: "Nequi",
  daviplata: "Daviplata",
  transfer: "Transfer",
};

const initialDraft: OrderItemDraft = {
  extraIds: [],
  quantity: 1,
};

export function PosTerminal() {
  const {
    businessDate,
    sizes,
    productTypes,
    flavors,
    activeFlavors,
    extras,
    orders,
    addOrder,
  } = useAppStore(
    useShallow((state) => ({
      businessDate: state.businessDate,
      sizes: state.sizes,
      productTypes: state.productTypes,
      flavors: state.flavors,
      activeFlavors: state.activeFlavors,
      extras: state.extras,
      orders: state.orders,
      addOrder: state.addOrder,
    })),
  );

  const [draft, setDraft] = useState<OrderItemDraft>(initialDraft);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [isSaving, setIsSaving] = useState(false);

  const todaysFlavors = useMemo(() => {
    return activeFlavors
      .filter((item) => item.businessDate === businessDate)
      .sort((a, b) => a.tankNumber - b.tankNumber)
      .map((active) => ({
        ...active,
        flavor: flavors.find((item) => item.id === active.flavorId),
      }))
      .filter((item) => item.flavor);
  }, [activeFlavors, businessDate, flavors]);

  const currentItem = useMemo(
    () =>
      calculateOrderItem({
        draft,
        sizes,
        productTypes,
        extras,
      }),
    [draft, extras, productTypes, sizes],
  );

  const cartTotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);

  const toggleExtra = (extraId: string) => {
    setDraft((current) => ({
      ...current,
      extraIds: current.extraIds.includes(extraId)
        ? current.extraIds.filter((item) => item !== extraId)
        : [...current.extraIds, extraId],
    }));
  };

  const addCurrentItem = () => {
    if (!currentItem) {
      toast.error("Completa tamaño, tipo y sabor para agregar el producto.");
      return;
    }

    setCart((current) => [...current, currentItem]);
    setDraft({ ...initialDraft, sizeId: draft.sizeId, typeId: draft.typeId });
    toast.success("Producto agregado al pedido.");
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart((current) =>
      current.flatMap((item) => {
        if (item.id !== itemId) {
          return [item];
        }

        const quantity = item.quantity + delta;
        if (quantity <= 0) {
          return [];
        }

        return [
          {
            ...item,
            quantity,
            lineTotal: item.unitPrice * quantity,
          },
        ];
      }),
    );
  };

  const clearOrder = () => {
    setCart([]);
    setDraft(initialDraft);
  };

  const saveOrder = () => {
    const items = [...cart];

    if (currentItem) {
      items.push(currentItem);
    }

    if (items.length === 0) {
      toast.error("Agrega al menos un producto antes de guardar.");
      return;
    }

    setIsSaving(true);

    startTransition(() => {
      const order = createOrderRecord({
        items,
        paymentMethod,
        sequence: orders.length,
        syncState: "pending",
      });

      addOrder(order);
      clearOrder();
      setPaymentMethod("cash");
      toast.success(`Pedido ${order.orderNumber} guardado.`);
      setIsSaving(false);
    });
  };

  const recentOrders = orders.slice(0, 6);

  return (
    <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Flujo rápido de venta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <StepBlock
              step="1"
              title="Tamaño"
              items={sizes.map((size) => ({
                id: size.id,
                label: size.label,
                caption: currency(size.price),
                active: draft.sizeId === size.id,
                onClick: () =>
                  setDraft((current) => ({ ...current, sizeId: size.id })),
              }))}
            />

            <StepBlock
              step="2"
              title="Tipo"
              items={productTypes.map((type) => ({
                id: type.id,
                label: type.label,
                caption:
                  type.priceModifier > 0
                    ? `+ ${currency(type.priceModifier)}`
                    : "Incluido",
                active: draft.typeId === type.id,
                onClick: () =>
                  setDraft((current) => ({ ...current, typeId: type.id })),
              }))}
            />

            <StepBlock
              step="3"
              title="Sabor activo"
              items={todaysFlavors.map((entry) => ({
                id: entry.id,
                label: entry.flavor?.name ?? "Sabor",
                caption: `Tanque ${entry.tankNumber}`,
                active: draft.flavorId === entry.flavorId,
                onClick: () =>
                  setDraft((current) => ({
                    ...current,
                    flavorId: entry.flavorId,
                  })),
              }))}
            />

            <StepBlock
              step="4"
              title="Extras"
              items={extras.map((extra) => ({
                id: extra.id,
                label: extra.name,
                caption: `+ ${currency(extra.price)}`,
                active: draft.extraIds.includes(extra.id),
                onClick: () => toggleExtra(extra.id),
              }))}
            />

            <StepBlock
              step="5"
              title="Pago"
              items={(Object.keys(paymentLabels) as PaymentMethod[]).map(
                (method) => ({
                  id: method,
                  label: paymentLabels[method],
                  caption: "Tap para elegir",
                  active: paymentMethod === method,
                  onClick: () => setPaymentMethod(method),
                }),
              )}
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-5">
        <Card className="sticky top-24">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle>Pedido actual</CardTitle>
              <Badge variant="secondary">
                {currency(cartTotal + (currentItem?.lineTotal ?? 0))}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/4 p-4">
              <p className="text-muted text-xs tracking-[0.18em] uppercase">
                Producto listo
              </p>
              {currentItem ? (
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {
                        sizes.find((item) => item.id === currentItem.sizeId)
                          ?.label
                      }{" "}
                      {
                        productTypes.find(
                          (item) => item.id === currentItem.typeId,
                        )?.label
                      }
                    </p>
                    <p className="text-muted text-sm">
                      {
                        flavors.find((item) => item.id === currentItem.flavorId)
                          ?.name
                      }
                    </p>
                  </div>
                  <p className="text-xl font-semibold">
                    {currency(currentItem.lineTotal)}
                  </p>
                </div>
              ) : (
                <p className="text-muted mt-3 text-sm">
                  Elige tamaño, tipo y sabor para ver el producto listo.
                </p>
              )}
              <div className="mt-4 flex gap-2">
                <Button className="flex-1" size="lg" onClick={addCurrentItem}>
                  <Plus className="size-4" />
                  Agregar
                </Button>
                <Button variant="ghost" size="lg" onClick={clearOrder}>
                  <Trash2 className="size-4" />
                  Limpiar
                </Button>
              </div>
            </div>

            <div className="mt-5">
              {cart.length === 0 ? (
                <EmptyState
                  icon={ShoppingBag}
                  title="Pedido vacío"
                  description="Agrega uno o varios productos para armar una orden combinada."
                />
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[1.5rem] border border-white/10 bg-white/4 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">
                            {
                              sizes.find((entry) => entry.id === item.sizeId)
                                ?.label
                            }{" "}
                            {
                              productTypes.find(
                                (entry) => entry.id === item.typeId,
                              )?.label
                            }
                          </p>
                          <p className="text-muted text-sm">
                            {
                              flavors.find(
                                (entry) => entry.id === item.flavorId,
                              )?.name
                            }
                          </p>
                        </div>
                        <p className="text-lg font-semibold">
                          {currency(item.lineTotal)}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateCartQuantity(item.id, -1)}
                          >
                            -1
                          </Button>
                          <Badge variant="muted">{item.quantity} u</Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateCartQuantity(item.id, 1)}
                          >
                            +1
                          </Button>
                        </div>
                        <Badge variant="default">
                          {currency(item.unitPrice)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-5 flex gap-2">
              <Button
                className="flex-1"
                size="lg"
                onClick={saveOrder}
                disabled={isSaving}
              >
                <ReceiptText className="size-4" />
                {isSaving ? "Guardando..." : "Guardar pedido"}
              </Button>
            </div>

            <div className="mt-6">
              <p className="text-muted text-xs tracking-[0.18em] uppercase">
                Historial de hoy
              </p>
              <ScrollArea className="mt-3 h-72">
                <div className="space-y-3 pr-3">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-[1.4rem] border border-white/10 bg-white/4 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{order.orderNumber}</p>
                          <p className="text-muted text-sm">
                            {formatTime(order.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {currency(order.total)}
                          </p>
                          <Badge
                            variant={
                              order.syncState === "synced"
                                ? "success"
                                : "warning"
                            }
                          >
                            {order.syncState}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StepBlock({
  step,
  title,
  items,
}: {
  step: string;
  title: string;
  items: Array<{
    id: string;
    label: string;
    caption: string;
    active: boolean;
    onClick: () => void;
  }>;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <div className="bg-primary/15 font-display text-primary flex size-10 items-center justify-center rounded-2xl">
          {step}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {items.map((item) => (
          <button
            key={item.id}
            className={`min-h-24 rounded-[1.6rem] border p-4 text-left transition-all ${
              item.active
                ? "border-primary/35 bg-primary/14 shadow-[0_0_26px_rgba(255,79,216,0.16)]"
                : "border-white/10 bg-white/4 hover:bg-white/8"
            }`}
            onClick={item.onClick}
            type="button"
          >
            <p className="text-base font-semibold">{item.label}</p>
            <p className="text-muted mt-2 text-sm">{item.caption}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
