"use client";

import { Plus, ReceiptText, ShoppingBag, Trash2 } from "lucide-react";
import { startTransition, useEffect, useMemo, useRef, useState } from "react";
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
};

const CREMOSO_PRICE_BY_SIZE_CODE: Record<string, number> = {
  "8oz": 10000,
  "12oz": 14000,
  "16oz": 17000,
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
  const topPageRef = useRef<HTMLDivElement>(null);
  const sizeStepRef = useRef<HTMLDivElement>(null);
  const flavorStepRef = useRef<HTMLDivElement>(null);
  const postFlavorRef = useRef<HTMLDivElement>(null);

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

  const sameSelection = (left: OrderItem, right: OrderItem) =>
    left.sizeId === right.sizeId &&
    left.typeId === right.typeId &&
    left.flavorId === right.flavorId &&
    left.extraIds.length === right.extraIds.length &&
    left.extraIds.every((extraId, index) => extraId === right.extraIds[index]);

  const cartTotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);
  const draftTotal = cartTotal + (currentItem?.lineTotal ?? 0);
  const showSizeStep = Boolean(draft.typeId);
  const showFlavorStep = Boolean(draft.typeId && draft.sizeId);
  const showPostFlavorSteps = Boolean(
    draft.typeId && draft.sizeId && draft.flavorId,
  );

  useEffect(() => {
    if (!showSizeStep) {
      return;
    }

    window.setTimeout(() => {
      sizeStepRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }, [showSizeStep]);

  useEffect(() => {
    if (!showFlavorStep) {
      return;
    }

    window.setTimeout(() => {
      flavorStepRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }, [showFlavorStep]);

  useEffect(() => {
    if (!showPostFlavorSteps) {
      return;
    }

    window.setTimeout(() => {
      postFlavorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }, [showPostFlavorSteps]);

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

    setCart((current) => {
      const matchingItem = current.find((item) =>
        sameSelection(item, currentItem),
      );

      if (!matchingItem) {
        return [...current, currentItem];
      }

      return current.map((item) =>
        item.id === matchingItem.id
          ? {
              ...item,
              quantity: item.quantity + currentItem.quantity,
              lineTotal:
                item.unitPrice * (item.quantity + currentItem.quantity),
            }
          : item,
      );
    });

    setDraft(initialDraft);
    setPaymentMethod("cash");

    window.setTimeout(() => {
      topPageRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);

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
    setPaymentMethod("cash");
  };

  const saveOrder = () => {
    const items = [...cart];

    if (currentItem && !cart.some((item) => sameSelection(item, currentItem))) {
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

  const summarizeItem = (item: OrderItem) => {
    const sizeLabel = sizes.find((entry) => entry.id === item.sizeId)?.label;
    const typeLabel = productTypes.find(
      (entry) => entry.id === item.typeId,
    )?.label;
    const flavorLabel = flavors.find(
      (entry) => entry.id === item.flavorId,
    )?.name;
    const extraNames = item.extraIds
      .map((extraId) => extras.find((entry) => entry.id === extraId)?.name)
      .filter((name): name is string => Boolean(name));

    return {
      sizeLabel,
      typeLabel,
      flavorLabel,
      extraNames,
    };
  };

  const recentOrders = orders.slice(0, 6);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const currentSummary = currentItem ? summarizeItem(currentItem) : null;
  const currentSummaryExtras = currentSummary?.extraNames ?? [];

  const selectType = (typeId: string) => {
    setDraft(() => ({
      ...initialDraft,
      typeId,
      quantity: 1,
    }));
  };

  const selectSize = (sizeId: string) => {
    setDraft((current) => ({
      ...current,
      sizeId,
      flavorId: undefined,
      extraIds: [],
    }));
  };

  const selectFlavor = (flavorId: string) => {
    setDraft((current) => ({
      ...current,
      flavorId,
      extraIds: [],
    }));
  };

  const cartPreviewItems = cart.slice(-3).map((item) => ({
    ...summarizeItem(item),
    quantity: item.quantity,
    lineTotal: item.lineTotal,
  }));

  const getSizeCaption = (sizeCode: string, basePrice: number) => {
    const selectedType = productTypes.find(
      (entry) => entry.id === draft.typeId,
    );

    if (selectedType?.code === "cremoso") {
      return `Precio especial ${currency(CREMOSO_PRICE_BY_SIZE_CODE[sizeCode] ?? basePrice)}`;
    }

    if (selectedType?.code === "picoso") {
      return `Precio especial ${currency(basePrice + selectedType.priceModifier)}`;
    }

    return currency(basePrice);
  };

  return (
    <>
      <div
        ref={topPageRef}
        className="grid gap-5 pb-28 xl:grid-cols-[1.2fr_0.8fr] xl:pb-0"
      >
        <div className="space-y-5">
          {cart.length > 0 ? (
            <Card className="border-white/10 bg-white/4">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  Productos ya agregados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{cart.length} líneas</Badge>
                  <Badge variant="muted">{cartCount} piezas</Badge>
                  <Badge variant="default">{currency(cartTotal)}</Badge>
                </div>
                <div className="space-y-2">
                  {cartPreviewItems.map((item, index) => (
                    <div
                      key={`${item.typeLabel ?? "item"}-${item.sizeLabel ?? "size"}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/12 p-3"
                    >
                      <div>
                        <p className="text-sm font-semibold">
                          {item.quantity}x {item.sizeLabel} {item.typeLabel}
                        </p>
                        <p className="text-muted text-xs">
                          {item.flavorLabel}
                          {item.extraNames.length > 0
                            ? ` · ${item.extraNames.join(", ")}`
                            : ""}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">
                        {currency(item.lineTotal)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>Flujo rápido de venta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <StepBlock
                step="1"
                title="Producto"
                items={productTypes.map((type) => ({
                  id: type.id,
                  label: type.label,
                  caption:
                    type.code === "cremoso" || type.code === "picoso"
                      ? "Precio por tamaño"
                      : type.priceModifier > 0
                        ? `+ ${currency(type.priceModifier)}`
                        : "Incluido",
                  active: draft.typeId === type.id,
                  onClick: () => selectType(type.id),
                }))}
              />

              {showSizeStep ? (
                <div ref={sizeStepRef} className="scroll-mt-36 md:scroll-mt-28">
                  <StepBlock
                    step="2"
                    title="Tamaño"
                    items={sizes.map((size) => ({
                      id: size.id,
                      label: size.label,
                      caption: draft.typeId
                        ? getSizeCaption(size.code, size.price)
                        : currency(size.price),
                      active: draft.sizeId === size.id,
                      onClick: () => selectSize(size.id),
                    }))}
                  />
                </div>
              ) : null}

              {showFlavorStep ? (
                <div
                  ref={flavorStepRef}
                  className="scroll-mt-36 md:scroll-mt-28"
                >
                  <StepBlock
                    step="3"
                    title="Sabor activo"
                    items={todaysFlavors.map((entry) => ({
                      id: entry.id,
                      label: entry.flavor?.name ?? "Sabor",
                      caption: `Tanque ${entry.tankNumber}`,
                      active: draft.flavorId === entry.flavorId,
                      onClick: () => selectFlavor(entry.flavorId),
                    }))}
                  />
                </div>
              ) : null}

              {showPostFlavorSteps ? (
                <div
                  ref={postFlavorRef}
                  className="scroll-mt-36 md:scroll-mt-28"
                >
                  <>
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
                      items={(
                        Object.keys(paymentLabels) as PaymentMethod[]
                      ).map((method) => ({
                        id: method,
                        label: paymentLabels[method],
                        caption:
                          method === "cash" ? "Default" : "Tap para elegir",
                        active: paymentMethod === method,
                        onClick: () => setPaymentMethod(method),
                      }))}
                    />
                  </>
                </div>
              ) : (
                <div className="rounded-3xl border border-white/10 bg-white/4 p-4">
                  <p className="text-muted text-sm">
                    Completa tipo, tamaño y sabor para habilitar extras, pago y
                    el resumen final.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="sticky top-24">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>Pedido actual</CardTitle>
                <Badge variant="secondary">{currency(draftTotal)}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {showPostFlavorSteps ? (
                <>
                  <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/4 p-3">
                      <p className="text-muted text-[0.7rem] tracking-[0.18em] uppercase">
                        Productos
                      </p>
                      <p className="mt-1 text-xl font-semibold">
                        {cart.length}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/4 p-3">
                      <p className="text-muted text-[0.7rem] tracking-[0.18em] uppercase">
                        Piezas
                      </p>
                      <p className="mt-1 text-xl font-semibold">{cartCount}</p>
                    </div>
                    <div className="border-primary/20 bg-primary/10 col-span-2 rounded-2xl border p-3 md:col-span-1">
                      <p className="text-muted text-[0.7rem] tracking-[0.18em] uppercase">
                        Total estimado
                      </p>
                      <p className="mt-1 text-xl font-semibold text-white">
                        {currency(draftTotal)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/4 p-4">
                    <p className="text-muted text-xs tracking-[0.18em] uppercase">
                      Previo de lo que se agrega
                    </p>
                    {currentItem ? (
                      <div className="mt-3 space-y-3">
                        <div>
                          <p className="font-semibold">
                            {currentSummary?.sizeLabel}{" "}
                            {currentSummary?.typeLabel}
                          </p>
                          <p className="text-muted text-sm">
                            {currentSummary?.flavorLabel}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {currentSummaryExtras.length ? (
                            currentSummaryExtras.map((extraName) => (
                              <Badge key={extraName} variant="muted">
                                {extraName}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="muted">Sin extras</Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/15 p-3">
                          <div>
                            <p className="text-muted text-xs tracking-[0.18em] uppercase">
                              Se agregará
                            </p>
                            <p className="text-sm font-semibold">
                              {currentItem.quantity} unidad
                              {currentItem.quantity > 1 ? "es" : ""}
                            </p>
                          </div>
                          <p className="text-xl font-semibold">
                            {currency(currentItem.lineTotal)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted mt-3 text-sm">
                        Elige tamaño, tipo y sabor para ver el producto listo.
                      </p>
                    )}
                    <div className="mt-4 hidden gap-2 md:flex">
                      <Button
                        className="flex-1"
                        size="lg"
                        onClick={addCurrentItem}
                      >
                        <Plus className="size-4" />
                        Agregar a orden
                      </Button>
                      <Button variant="ghost" size="lg" onClick={clearOrder}>
                        <Trash2 className="size-4" />
                        Reiniciar pedido
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
                            className="rounded-3xl border border-white/10 bg-white/4 p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-semibold">
                                  {
                                    sizes.find(
                                      (entry) => entry.id === item.sizeId,
                                    )?.label
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
                                  onClick={() =>
                                    updateCartQuantity(item.id, -1)
                                  }
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

                  <div className="mt-5 hidden gap-2 md:flex">
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
                </>
              ) : (
                <div className="rounded-3xl border border-white/10 bg-white/4 p-4">
                  <p className="text-muted text-sm">
                    El resumen y las acciones aparecerán cuando completes tipo,
                    tamaño y sabor.
                  </p>
                </div>
              )}

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

      {showPostFlavorSteps ? (
        <div className="bg-background/95 fixed inset-x-0 bottom-0 z-30 border-t border-white/10 p-3 backdrop-blur md:hidden">
          <div className="mx-auto grid max-w-3xl grid-cols-[1fr_1fr_auto] gap-2">
            <Button size="lg" onClick={addCurrentItem}>
              <Plus className="size-4" />
              Agregar a orden
            </Button>
            <Button size="lg" onClick={saveOrder} disabled={isSaving}>
              <ReceiptText className="size-4" />
              {isSaving ? "Guardando..." : "Guardar pedido"}
            </Button>
            <Button variant="ghost" size="lg" onClick={clearOrder}>
              <Trash2 className="size-4" />
            </Button>
          </div>
          <p className="text-muted mt-2 text-center text-xs">
            Total: {currency(draftTotal)}
          </p>
        </div>
      ) : null}
    </>
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
