"use client";

import {
  Plus,
  ReceiptText,
  ShoppingBag,
  Trash2,
  UserCheck,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoyaltyScannerModal } from "@/components/pos/loyalty-scanner-modal";
import {
  calculateOrderItem,
  createOrderRecord,
  getBusinessDate,
  PRICE_MATRIX,
} from "@/lib/business";
import { calculateInventoryShortages } from "@/lib/inventory-consumption";
import { syncPendingOrders } from "@/services/sync-service";
import { currency, formatTime } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";
import type {
  ActiveFlavor,
  OrderItem,
  OrderItemDraft,
  PaymentMethod,
} from "@/types/domain";

const paymentLabels: Record<PaymentMethod, string> = {
  cash: "Efectivo",
  nequi: "Nequi",
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
    inventoryItems,
    inventoryConsumptionRules,
    orders,
    addOrder,
    markOrdersSynced,
  } = useAppStore(
    useShallow((state) => ({
      businessDate: state.businessDate,
      sizes: state.sizes,
      productTypes: state.productTypes,
      flavors: state.flavors,
      activeFlavors: state.activeFlavors,
      extras: state.extras,
      inventoryItems: state.inventoryItems,
      inventoryConsumptionRules: state.inventoryConsumptionRules,
      orders: state.orders,
      addOrder: state.addOrder,
      markOrdersSynced: state.markOrdersSynced,
    })),
  );

  const [draft, setDraft] = useState<OrderItemDraft>(initialDraft);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [isSaving, setIsSaving] = useState(false);
  const [category, setCategory] = useState<"granizados" | "gomitas-enchilada">(
    "granizados",
  );
  const [loyaltyModalOpen, setLoyaltyModalOpen] = useState(false);
  const [selectedLoyaltyCustomer, setSelectedLoyaltyCustomer] = useState<{
    id: string;
    fullName: string;
    phone: string;
    email?: string | null;
    stampsCount: number;
    totalRewardsClaimed: number;
    passToken: string;
  } | null>(null);
  const topPageRef = useRef<HTMLDivElement>(null);
  const sizeStepRef = useRef<HTMLDivElement>(null);
  const flavorStepRef = useRef<HTMLDivElement>(null);
  const postFlavorRef = useRef<HTMLDivElement>(null);

  const todaysFlavors = useMemo(() => {
    const targetDate = (businessDate || getBusinessDate()).slice(0, 10);
    let activeList = activeFlavors.filter(
      (item) => (item.businessDate || "").slice(0, 10) === targetDate,
    );

    if (activeList.length === 0 && activeFlavors.length > 0) {
      const latestByTank = new Map<number, ActiveFlavor>();
      activeFlavors.forEach((af) => {
        if (af.tankNumber && !latestByTank.has(af.tankNumber)) {
          latestByTank.set(af.tankNumber, af);
        }
      });
      activeList = Array.from(latestByTank.values());
    }

    return activeList
      .sort((a, b) => a.tankNumber - b.tankNumber)
      .map((active) => ({
        ...active,
        flavor: flavors.find((item) => item.id === active.flavorId),
      }))
      .filter(
        (
          item,
        ): item is typeof item & {
          flavor: NonNullable<(typeof item)["flavor"]>;
        } => Boolean(item.flavor),
      );
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

  const sameSelection = useCallback(
    (left: OrderItem, right: OrderItem) =>
      left.sizeId === right.sizeId &&
      left.typeId === right.typeId &&
      left.flavorId === right.flavorId &&
      left.extraIds.length === right.extraIds.length &&
      left.extraIds.every(
        (extraId, index) => extraId === right.extraIds[index],
      ),
    [],
  );

  const cartTotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);
  const draftTotal = cartTotal + (currentItem?.lineTotal ?? 0);
  const showSizeStep = Boolean(draft.typeId);
  const showFlavorStep = Boolean(draft.typeId && draft.sizeId);
  const showPostFlavorSteps = Boolean(
    draft.typeId && draft.sizeId && draft.flavorId,
  );

  const pendingOrderItems = useMemo(() => {
    const items = [...cart];

    if (currentItem) {
      const existingIndex = items.findIndex((item) =>
        sameSelection(item, currentItem),
      );

      if (existingIndex >= 0) {
        const existing = items[existingIndex];
        items[existingIndex] = {
          ...existing,
          quantity: existing.quantity + currentItem.quantity,
          lineTotal:
            existing.unitPrice * (existing.quantity + currentItem.quantity),
        };
      } else {
        items.push(currentItem);
      }
    }

    return items;
  }, [cart, currentItem, sameSelection]);

  const inventoryShortages = useMemo(
    () =>
      calculateInventoryShortages({
        items: pendingOrderItems,
        catalog: {
          sizes,
          extras,
          flavors,
          rules: inventoryConsumptionRules,
        },
        inventoryItems,
      }),
    [
      pendingOrderItems,
      sizes,
      extras,
      flavors,
      inventoryConsumptionRules,
      inventoryItems,
    ],
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

    if (category === "gomitas-enchilada") {
      const neutralFlavor = flavors.find(
        (f) => f.name.includes("Enchilado") || f.name.includes("Directo"),
      );
      const ptGomitas = productTypes.find(
        (t) => t.code === "gomitas-enchilada",
      );
      setDraft({
        typeId: ptGomitas?.id,
        flavorId: neutralFlavor?.id,
        extraIds: [],
        quantity: 1,
      });
    } else {
      setDraft(initialDraft);
    }
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
    if (category === "gomitas-enchilada") {
      const neutralFlavor = flavors.find(
        (f) => f.name.includes("Enchilado") || f.name.includes("Directo"),
      );
      const ptGomitas = productTypes.find(
        (t) => t.code === "gomitas-enchilada",
      );
      setDraft({
        typeId: ptGomitas?.id,
        flavorId: neutralFlavor?.id,
        extraIds: [],
        quantity: 1,
      });
    } else {
      setDraft(initialDraft);
    }
    setPaymentMethod("cash");
  };

  const saveOrder = async () => {
    const items = pendingOrderItems;

    if (items.length === 0) {
      toast.error("Agrega al menos un producto antes de guardar.");
      return;
    }

    if (inventoryShortages.length > 0) {
      const summary = inventoryShortages
        .slice(0, 3)
        .map((item) => `${item.itemName} (${item.missing.toFixed(2)})`)
        .join(", ");

      toast.warning(
        `Pedido guardado con faltantes de stock: ${summary}. Revisa inventario luego.`,
      );
    }

    setIsSaving(true);

    try {
      // Get the next sequence from the database to maintain persistent numbering
      const nextNumberRes = await fetch("/api/orders/next-number", {
        cache: "no-store",
      });
      if (!nextNumberRes.ok) throw new Error("Failed to get next order number");
      const { sequence } = await nextNumberRes.json();

      const order = createOrderRecord({
        items,
        paymentMethod,
        sequence,
        syncState: "pending",
      });

      addOrder(order);
      clearOrder();
      setPaymentMethod("cash");
      toast.success(`Pedido ${order.orderNumber} guardado.`);

      // Apply loyalty stamps if customer selected
      if (selectedLoyaltyCustomer) {
        const stampsToAdd = items.reduce((sum, item) => sum + item.quantity, 0);
        const redeemReward =
          selectedLoyaltyCustomer.stampsCount + stampsToAdd >= 10;

        try {
          const stampRes = await fetch("/api/loyalty/stamp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              passToken: selectedLoyaltyCustomer.passToken || undefined,
              phone: selectedLoyaltyCustomer.phone,
              orderId: order.id,
              stampsToAdd,
              redeemReward,
            }),
          });

          if (stampRes.ok) {
            const stampData = await stampRes.json();
            if (stampData.rewardRedeemed) {
              toast.success("🎁 ¡Raspado gratis canjeado!", { duration: 4000 });
            } else if (stampData.newStampsCount >= 10) {
              toast.success("🎁 ¡Raspado gratis disponible!", {
                duration: 4000,
              });
            } else {
              toast.success(`${stampData.message}`, { duration: 3000 });
            }
          } else {
            toast.warning(
              "Sellos guardados localmente, se sincronizarán luego",
            );
          }
        } catch {
          toast.warning("Sellos guardados localmente, se sincronizarán luego");
        }

        setSelectedLoyaltyCustomer(null);
      }

      if (navigator.onLine) {
        try {
          const syncedIds = await syncPendingOrders([order]);

          if (syncedIds.length > 0) {
            markOrdersSynced(syncedIds);
            toast.success(
              `Pedido ${order.orderNumber} sincronizado en base de datos.`,
            );
          }
        } catch {
          toast.warning(
            "Pedido guardado localmente. La sincronización remota se reintentará.",
          );
        }
      }
    } finally {
      setIsSaving(false);
    }
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

  const getSizeCaption = (sizeCode: string) => {
    const selectedType = productTypes.find(
      (entry) => entry.id === draft.typeId,
    );

    if (!selectedType) return "";

    const price = PRICE_MATRIX[selectedType.code]?.[sizeCode];
    if (price == null) return "No disponible";

    if (selectedType.code !== "basico") {
      return `Precio especial ${currency(price)}`;
    }

    return currency(price);
  };

  return (
    <>
      <div
        ref={topPageRef}
        className="grid gap-5 pb-64 xl:grid-cols-[1.2fr_0.8fr] xl:pb-0"
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
              <div className="flex gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
                <Button
                  variant={category === "granizados" ? "default" : "ghost"}
                  className="flex-1 rounded-xl text-sm"
                  onClick={() => {
                    setCategory("granizados");
                    setDraft(initialDraft);
                  }}
                  type="button"
                >
                  🍹 Granizados
                </Button>
                <Button
                  variant={
                    category === "gomitas-enchilada" ? "default" : "ghost"
                  }
                  className="flex-1 rounded-xl text-sm"
                  onClick={() => {
                    setCategory("gomitas-enchilada");
                    const neutralFlavor = flavors.find(
                      (f) =>
                        f.name.includes("Enchilado") ||
                        f.name.includes("Directo"),
                    );
                    const ptGomitas = productTypes.find(
                      (t) => t.code === "gomitas-enchilada",
                    );
                    setDraft({
                      typeId:
                        ptGomitas?.id || "44444444-5555-5555-5555-555555555555",
                      flavorId:
                        neutralFlavor?.id ||
                        "88888888-8888-8888-8888-888888888888",
                      extraIds: [],
                      quantity: 1,
                    });
                  }}
                  type="button"
                >
                  🌶️ Gomitas Enchiladas
                </Button>
              </div>

              {category === "granizados" ? (
                <StepBlock
                  step="1"
                  title="Producto"
                  items={productTypes
                    .filter((type) => type.code !== "gomitas-enchilada")
                    .map((type) => ({
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
              ) : null}

              {showSizeStep || category === "gomitas-enchilada" ? (
                <div ref={sizeStepRef} className="scroll-mt-36 md:scroll-mt-28">
                  <StepBlock
                    step={category === "granizados" ? "2" : "1"}
                    title="Presentación"
                    items={(category === "granizados"
                      ? sizes.filter(
                          (size) =>
                            size.code !== "3k" &&
                            size.code !== "6k" &&
                            size.code !== "10k",
                        )
                      : sizes.filter(
                            (size) =>
                              size.code === "3k" ||
                              size.code === "6k" ||
                              size.code === "10k",
                          ).length > 0
                        ? sizes.filter(
                            (size) =>
                              size.code === "3k" ||
                              size.code === "6k" ||
                              size.code === "10k",
                          )
                        : [
                            {
                              id: "33333333-3000-3000-3000-333333333333",
                              code: "3k",
                              label: "Vasito 3K",
                              ounces: 3,
                              price: 3000,
                              baseCost: 1000,
                            },
                            {
                              id: "33333333-6000-6000-6000-333333333333",
                              code: "6k",
                              label: "Mediano 6K",
                              ounces: 6,
                              price: 6000,
                              baseCost: 2000,
                            },
                            {
                              id: "33333333-9000-9000-9000-333333333333",
                              code: "10k",
                              label: "Grande 10K",
                              ounces: 10,
                              price: 10000,
                              baseCost: 3500,
                            },
                          ]
                    ).map((size) => ({
                      id: size.id,
                      label: size.label,
                      caption:
                        category === "granizados" && draft.typeId
                          ? getSizeCaption(size.code)
                          : currency(size.price),
                      active: draft.sizeId === size.id,
                      onClick: () => {
                        if (category === "gomitas-enchilada") {
                          const neutralFlavor = flavors.find(
                            (f) =>
                              f.name.includes("Enchilado") ||
                              f.name.includes("Directo"),
                          );
                          const ptGomitas = productTypes.find(
                            (t) => t.code === "gomitas-enchilada",
                          );
                          setDraft((current) => ({
                            ...current,
                            typeId:
                              ptGomitas?.id ||
                              "44444444-5555-5555-5555-555555555555",
                            flavorId:
                              neutralFlavor?.id ||
                              "88888888-8888-8888-8888-888888888888",
                            sizeId: size.id,
                            extraIds: [],
                          }));
                        } else {
                          selectSize(size.id);
                        }
                      },
                    }))}
                  />
                </div>
              ) : null}

              {category === "granizados" && showFlavorStep ? (
                <div
                  ref={flavorStepRef}
                  className="scroll-mt-36 md:scroll-mt-28"
                >
                  {todaysFlavors.length > 0 ? (
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
                  ) : (
                    <div>
                      <div className="mb-3 flex items-center gap-3">
                        <div className="bg-primary/15 font-display text-primary flex size-10 items-center justify-center rounded-2xl">
                          3
                        </div>
                        <h3 className="text-lg font-semibold">Sabor activo</h3>
                      </div>
                      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
                        <p className="text-sm font-semibold text-amber-200">
                          ⚠️ No hay sabores asignados a los tanques para hoy.
                        </p>
                        <p className="mt-1 text-xs text-amber-100/80">
                          Por favor asigna los tanques del día en el módulo{" "}
                          <strong>Sabores</strong> (Administración) para
                          habilitar las ventas.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              {showPostFlavorSteps ? (
                <div
                  ref={postFlavorRef}
                  className="scroll-mt-36 md:scroll-mt-28"
                >
                  <>
                    {category === "granizados" ? (
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
                    ) : null}

                    <StepBlock
                      step={category === "granizados" ? "5" : "2"}
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
              ) : category === "granizados" ? (
                <div className="rounded-3xl border border-white/10 bg-white/4 p-4">
                  <p className="text-muted text-sm">
                    Completa tipo, tamaño y sabor para habilitar extras, pago y
                    el resumen final.
                  </p>
                </div>
              ) : (
                <div className="rounded-3xl border border-white/10 bg-white/4 p-4">
                  <p className="text-muted text-sm">
                    Selecciona una presentación de Gomitas Enchiladas para
                    habilitar el pago y agregar al pedido.
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
                        {category === "granizados"
                          ? "Elige tamaño, tipo y sabor para ver el producto listo."
                          : "Elige una presentación para ver el producto listo."}
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
                    {inventoryShortages.length > 0 ? (
                      <div className="mb-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3">
                        <p className="text-sm font-semibold text-amber-200">
                          Advertencia: faltan insumos críticos
                        </p>
                        <ul className="mt-2 space-y-1 text-xs text-amber-100">
                          {inventoryShortages.map((item) => (
                            <li key={item.inventoryItemId}>
                              {item.itemName}: requiere{" "}
                              {item.required.toFixed(2)} y hay{" "}
                              {item.available.toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

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
                                  {sizes.find(
                                    (entry) =>
                                      entry.id === item.sizeId ||
                                      entry.code === item.sizeId,
                                  )?.label ||
                                    (item.sizeId ===
                                    "33333333-3000-3000-3000-333333333333"
                                      ? "Vasito 3K"
                                      : item.sizeId ===
                                          "33333333-6000-6000-6000-333333333333"
                                        ? "Mediano 6K"
                                        : item.sizeId ===
                                            "33333333-9000-9000-9000-333333333333"
                                          ? "Grande 10K"
                                          : "Tamaño")}{" "}
                                  {productTypes.find(
                                    (entry) =>
                                      entry.id === item.typeId ||
                                      entry.code === item.typeId,
                                  )?.label ||
                                    (item.typeId ===
                                    "44444444-5555-5555-5555-555555555555"
                                      ? "Gomitas Enchiladas"
                                      : "Producto")}
                                </p>
                                <p className="text-muted text-sm">
                                  {flavors.find(
                                    (entry) => entry.id === item.flavorId,
                                  )?.name ||
                                    (item.typeId ===
                                    "44444444-5555-5555-5555-555555555555"
                                      ? "Enchilado / Directo"
                                      : "")}
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
                      variant={
                        selectedLoyaltyCustomer ? "default" : "secondary"
                      }
                      className="flex-1"
                      size="lg"
                      onClick={() => setLoyaltyModalOpen(true)}
                      disabled={isSaving}
                    >
                      <UserCheck className="size-4" />
                      {selectedLoyaltyCustomer
                        ? `${selectedLoyaltyCustomer.fullName} (${selectedLoyaltyCustomer.stampsCount}/10)`
                        : "💎 Tarjeta NEON"}
                    </Button>
                    <Button
                      className="flex-1"
                      size="lg"
                      onClick={() => void saveOrder()}
                      disabled={isSaving}
                    >
                      <ReceiptText className="size-4" />
                      {isSaving ? "Guardando..." : "Guardar pedido"}
                    </Button>
                    <Button variant="ghost" size="lg" onClick={clearOrder}>
                      <Trash2 className="size-4" />
                      Reiniciar
                    </Button>
                  </div>
                </>
              ) : (
                <div className="rounded-3xl border border-white/10 bg-white/4 p-4">
                  <p className="text-muted text-sm">
                    {category === "granizados"
                      ? "El resumen y las acciones aparecerán cuando completes tipo, tamaño y sabor."
                      : "El resumen y las acciones aparecerán cuando selecciones una presentación."}
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
        <div className="bg-background/95 fixed inset-x-0 bottom-0 z-30 border-t border-white/10 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-2">
            <Button
              size="lg"
              className="col-span-2"
              onClick={addCurrentItem}
            >
              <Plus className="size-4" />
              Agregar a orden
            </Button>
            <Button
              variant={selectedLoyaltyCustomer ? "default" : "secondary"}
              className="w-full"
              size="lg"
              onClick={() => setLoyaltyModalOpen(true)}
              disabled={isSaving}
            >
              <UserCheck className="size-4" />
              {selectedLoyaltyCustomer
                ? `${selectedLoyaltyCustomer.stampsCount}/10`
                : "💎 Tarjeta NEON"}
            </Button>
            <Button
              size="lg"
              className="w-full"
              onClick={() => void saveOrder()}
              disabled={isSaving}
            >
              <ReceiptText className="size-4" />
              {isSaving ? "Guardando..." : "Guardar pedido"}
            </Button>
            <Button variant="ghost" size="lg" className="w-full" onClick={clearOrder}>
              <Trash2 className="size-4" />
              Reiniciar
            </Button>
            <div className="flex items-center justify-end pr-2">
              <p className="text-muted text-sm">
                Total: <span className="text-white font-semibold">{currency(draftTotal)}</span>
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <LoyaltyScannerModal
        isOpen={loyaltyModalOpen}
        onClose={() => setLoyaltyModalOpen(false)}
        onCustomerFound={setSelectedLoyaltyCustomer}
      />
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
