"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FlaskConical, Plus, ShoppingCart, Trash2 } from "lucide-react";
import {
  LIQUID_VARIANT_CONFIG,
  LIQUID_VARIANTS,
  LIQUID_YIELD_LITERS,
  LiquidVariantCode,
  getSuggestedLiquidPrice,
} from "@/lib/constants";
import { currency } from "@/lib/utils";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PaymentMethod } from "@/types/domain";

interface LiquidDraftItem {
  id: string;
  variant: LiquidVariantCode;
  variantLabel: string;
  flavorId: string | null;
  flavorName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  isWholesale?: boolean;
  pricingNote?: string;
}

export function LiquidSaleModal({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const businessDate = useAppStore((state) => state.businessDate);
  const flavors = useAppStore((state) => state.flavors);
  const liquidInventory = useAppStore((state) => state.liquidInventory) || [];
  const addLiquidSale = useAppStore((state) => state.addLiquidSale);

  // Common Header State
  const [saleDate, setSaleDate] = useState<string>(businessDate);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [customerName, setCustomerName] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Added Items List
  const [items, setItems] = useState<LiquidDraftItem[]>([]);

  // Item Picker State
  const [variant, setVariant] = useState<LiquidVariantCode>("base_sin_licor");
  const [flavorId, setFlavorId] = useState<string>("none");
  const [customFlavor, setCustomFlavor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [unitPriceInput, setUnitPriceInput] = useState<string>("");
  const [isCustomPrice, setIsCustomPrice] = useState<boolean>(false);

  const currentConfig = LIQUID_VARIANT_CONFIG[variant];
  const standardUnitPrice = currentConfig?.price ?? 0;

  const suggested = getSuggestedLiquidPrice(variant, quantity);
  const activeUnitPrice = isCustomPrice && unitPriceInput !== ""
    ? Number(unitPriceInput) || 0
    : suggested.unitPrice;

  const itemTotal = activeUnitPrice * quantity;

  const handleVariantChange = (newVariant: LiquidVariantCode) => {
    setVariant(newVariant);
    if (!isCustomPrice) {
      setUnitPriceInput("");
    }
  };

  const handleQuantityChange = (newQty: number) => {
    const validQty = Math.max(1, newQty);
    setQuantity(validQty);
    if (!isCustomPrice) {
      setUnitPriceInput("");
    }
  };

  const applyPresetPrice = (type: "standard" | "wholesale6" | "wholesale10") => {
    setIsCustomPrice(true);
    const hasAlcohol = currentConfig?.hasAlcohol ?? false;
    if (type === "standard") {
      const price = hasAlcohol ? 35000 : 30000;
      setUnitPriceInput(String(price));
    } else if (type === "wholesale6") {
      if (quantity < 6) setQuantity(6);
      const price = Math.round((hasAlcohol ? 200000 : 170000) / 6);
      setUnitPriceInput(String(price));
    } else if (type === "wholesale10") {
      if (quantity < 10) setQuantity(10);
      const price = hasAlcohol ? 30000 : 26000;
      setUnitPriceInput(String(price));
    }
  };

  const resetToAutoPrice = () => {
    setIsCustomPrice(false);
    setUnitPriceInput("");
  };

  const handleAddItem = () => {
    if (quantity <= 0) {
      toast.error("La cantidad debe ser al menos 1");
      return;
    }

    if (activeUnitPrice <= 0) {
      toast.error("El precio unitario debe ser mayor a $0");
      return;
    }

    let finalFlavorName = "Sin sabor específico";
    let finalFlavorId: string | null = null;

    if (flavorId === "custom") {
      finalFlavorName = customFlavor.trim() || "Sabor Personalizado";
      finalFlavorId = null;
    } else if (flavorId !== "none") {
      const selected = flavors.find((f) => f.id === flavorId);
      finalFlavorName = selected ? selected.name : "Sabor Específico";
      finalFlavorId = flavorId;
    }

    const isWholesale = activeUnitPrice < standardUnitPrice;
    let pricingNote = "";
    if (isWholesale) {
      pricingNote = `Mayorista: ${currency(activeUnitPrice)} c/u`;
    }

    const newItem: LiquidDraftItem = {
      id: crypto.randomUUID(),
      variant,
      variantLabel: currentConfig.label,
      flavorId: finalFlavorId,
      flavorName: finalFlavorName,
      quantity,
      unitPrice: activeUnitPrice,
      total: itemTotal,
      isWholesale,
      pricingNote,
    };

    setItems((prev) => [...prev, newItem]);
    setQuantity(1);
    setIsCustomPrice(false);
    setUnitPriceInput("");
    toast.success(
      `Añadido: ${quantity}x ${currentConfig.label} (${finalFlavorName}) a ${currency(activeUnitPrice)} c/u`,
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const grandTotal = items.reduce((acc, item) => acc + item.total, 0);
  const totalBottles = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalLiters = totalBottles * LIQUID_YIELD_LITERS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalItems = [...items];

    // If user didn't explicitly tap "Agregar ítem" but selected valid choices, automatically include it
    if (finalItems.length === 0 && quantity > 0) {
      let finalFlavorName = "Sin sabor específico";
      let finalFlavorId: string | null = null;

      if (flavorId === "custom") {
        finalFlavorName = customFlavor.trim() || "Sabor Personalizado";
        finalFlavorId = null;
      } else if (flavorId !== "none") {
        const selected = flavors.find((f) => f.id === flavorId);
        finalFlavorName = selected ? selected.name : "Sabor Específico";
        finalFlavorId = flavorId;
      }

      finalItems = [
        {
          id: crypto.randomUUID(),
          variant,
          variantLabel: currentConfig.label,
          flavorId: finalFlavorId,
          flavorName: finalFlavorName,
          quantity,
          unitPrice: activeUnitPrice,
          total: activeUnitPrice * quantity,
          isWholesale: activeUnitPrice < standardUnitPrice,
        },
      ];
    }

    if (finalItems.length === 0) {
      toast.error("Agrega al menos un líquido a la venta");
      return;
    }

    setIsSubmitting(true);
    try {
      // Process each item in the multi-item sale
      finalItems.forEach((item) => {
        addLiquidSale({
          saleDate,
          variant: item.variant,
          flavorId: item.flavorId,
          flavorName: item.flavorName,
          quantity: item.quantity,
          paymentMethod,
          customerName: customerName.trim() || null,
          notes: notes.trim() || null,
        });
      });

      const totalQty = finalItems.reduce((sum, i) => sum + i.quantity, 0);
      const totalCost = finalItems.reduce((sum, i) => sum + i.total, 0);

      toast.success(
        `Venta registrada exitosamente: ${totalQty} botellas (${currency(totalCost)})`,
      );

      // Reset form
      setItems([]);
      setQuantity(1);
      setCustomerName("");
      setNotes("");
      setCustomFlavor("");
      setOpen(false);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Error al registrar la venta",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full justify-center gap-2 shadow-[0_0_20px_rgba(255,79,216,0.25)] sm:w-auto">
            <Plus className="size-4" />
            Nueva Venta de Líquidos
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="flex max-h-[92vh] w-[95vw] max-w-2xl flex-col overflow-hidden rounded-3xl border-white/10 bg-[#0f071a]/98 p-4 backdrop-blur-xl sm:w-full sm:p-6">
        <DialogHeader className="flex-none pb-2">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold sm:text-xl">
            <FlaskConical className="text-primary size-5 shrink-0" />
            Registrar Venta de Líquidos Concentrados
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Agrega múltiples botellas de distintos sabores en una sola
            transacción comercial.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="mt-1 flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          {/* Scrollable Form Body */}
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1 sm:pr-2">
            {/* Header Controls: Date & Payment Method */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="saleDate" className="text-xs font-semibold">
                  Fecha Comercial
                </Label>
                <Input
                  id="saleDate"
                  type="date"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                  required
                  className="h-9 text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="paymentMethod"
                  className="text-xs font-semibold"
                >
                  Método de Pago
                </Label>
                <Select
                  value={paymentMethod}
                  onValueChange={(val) =>
                    setPaymentMethod(val as PaymentMethod)
                  }
                >
                  <SelectTrigger
                    id="paymentMethod"
                    className="h-9 text-xs sm:text-sm"
                  >
                    <SelectValue placeholder="Seleccionar pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Efectivo</SelectItem>
                    <SelectItem value="nequi">Nequi</SelectItem>
                    <SelectItem value="daviplata">Daviplata</SelectItem>
                    <SelectItem value="transfer">
                      Transferencia Bancaria
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Selector Card for Adding Items */}
            <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                  Seleccionar Producto y Sabor
                </span>
                <Badge
                  variant="secondary"
                  className="text-[10px] sm:text-[11px]"
                >
                  {currency(activeUnitPrice)} / botella
                </Badge>
              </div>

              {/* Variant Buttons */}
              <div className="grid grid-cols-2 gap-2">
                {LIQUID_VARIANTS.map((vKey) => {
                  const itemConfig = LIQUID_VARIANT_CONFIG[vKey];
                  const isSelected = variant === vKey;
                  return (
                    <button
                      key={vKey}
                      type="button"
                      onClick={() => handleVariantChange(vKey)}
                      className={`flex flex-col items-start rounded-xl border p-2.5 text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/20 text-white shadow-[0_0_15px_rgba(255,79,216,0.3)]"
                          : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className="truncate text-xs font-bold">
                          {itemConfig.label}
                        </span>
                        {itemConfig.hasAlcohol && (
                          <Badge
                            variant="warning"
                            className="ml-1 shrink-0 px-1 py-0 text-[8px] sm:text-[9px]"
                          >
                            Licor
                          </Badge>
                        )}
                      </div>
                      <span className="text-primary mt-1 text-xs font-extrabold">
                        {currency(itemConfig.price)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Preset Pricing Shortcuts */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted text-[10px] font-semibold tracking-wider uppercase">
                    Tarifa de Venta / Descuentos por Mayor:
                  </span>
                  <span className="text-primary text-[11px] font-extrabold">
                    {suggested.tierLabel}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyPresetPrice("standard")}
                    className={`rounded-lg border px-2 py-1 text-[11px] font-semibold transition-all ${
                      !isCustomPrice && quantity < 6
                        ? "border-primary/50 bg-primary/20 text-white"
                        : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    Detal ({currency(currentConfig.hasAlcohol ? 35000 : 30000)})
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPresetPrice("wholesale6")}
                    className={`rounded-lg border px-2 py-1 text-[11px] font-semibold transition-all ${
                      quantity >= 6 && quantity < 10 && !isCustomPrice
                        ? "border-amber-500/50 bg-amber-500/20 text-amber-300"
                        : "border-white/10 bg-white/5 text-amber-400/80 hover:bg-amber-500/10 hover:text-amber-300"
                    }`}
                  >
                    Paquete x6 ({currency(currentConfig.hasAlcohol ? 200000 : 170000)})
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPresetPrice("wholesale10")}
                    className={`rounded-lg border px-2 py-1 text-[11px] font-semibold transition-all ${
                      quantity >= 10 && !isCustomPrice
                        ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
                        : "border-white/10 bg-white/5 text-emerald-400/80 hover:bg-emerald-500/10 hover:text-emerald-300"
                    }`}
                  >
                    Paquete x10 ({currency(currentConfig.hasAlcohol ? 300000 : 260000)})
                  </button>

                  {isCustomPrice && (
                    <button
                      type="button"
                      onClick={resetToAutoPrice}
                      className="text-muted underline hover:text-white text-[10px] ml-auto"
                    >
                      Restablecer precio auto
                    </button>
                  )}
                </div>
              </div>

              {/* Flavor, Quantity & Custom Price Controls */}
              <div className="grid grid-cols-1 items-end gap-2.5 pt-1 sm:grid-cols-12">
                <div className="space-y-1.5 sm:col-span-5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="flavor" className="text-xs">
                      Sabor del Líquido
                    </Label>
                    {(() => {
                      const selectedFlavorObj = flavors.find(
                        (f) => f.id === flavorId,
                      );
                      const selectedStockItem = liquidInventory.find(
                        (item) =>
                          (flavorId !== "none" &&
                            flavorId !== "custom" &&
                            item.flavorId === flavorId) ||
                          (selectedFlavorObj &&
                            item.flavorName.toLowerCase() ===
                              selectedFlavorObj.name.toLowerCase()) ||
                          (flavorId === "custom" &&
                            customFlavor &&
                            item.flavorName.toLowerCase() ===
                              customFlavor.trim().toLowerCase()),
                      );

                      if (!selectedStockItem) return null;
                      const inStock = selectedStockItem.currentStock;
                      return (
                        <span
                          className={`text-[10px] font-bold ${
                            inStock > 0 ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          Stock: {inStock} bolsa(s)
                        </span>
                      );
                    })()}
                  </div>
                  <Select value={flavorId} onValueChange={setFlavorId}>
                    <SelectTrigger id="flavor" className="h-9 text-xs">
                      <SelectValue placeholder="Seleccionar sabor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin sabor específico</SelectItem>
                      {flavors.map((f) => {
                        const stockItem = liquidInventory.find(
                          (inv) =>
                            inv.flavorId === f.id ||
                            inv.flavorName.toLowerCase() ===
                              f.name.toLowerCase(),
                        );
                        const stockCount = stockItem
                          ? stockItem.currentStock
                          : null;

                        return (
                          <SelectItem key={f.id} value={f.id}>
                            {f.name}{" "}
                            {stockCount !== null
                              ? `(${stockCount} en stock)`
                              : ""}
                          </SelectItem>
                        );
                      })}
                      <SelectItem value="custom">
                        ✏️ Escribir otro sabor...
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {flavorId === "custom" ? (
                  <div className="space-y-1.5 sm:col-span-12">
                    <Label htmlFor="customFlavor" className="text-xs">
                      Nombre del Sabor Personalizado
                    </Label>
                    <Input
                      id="customFlavor"
                      placeholder="Ej: Fresa, Uva, Maracuyá..."
                      value={customFlavor}
                      onChange={(e) => setCustomFlavor(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                ) : null}

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="quantity" className="text-xs">
                    Cantidad
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(Number(e.target.value))
                    }
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="unitPrice" className="text-xs font-semibold">
                      Precio Unitario ($)
                    </Label>
                    {activeUnitPrice < standardUnitPrice && (
                      <span className="text-emerald-400 text-[10px] font-bold">
                        Descuento aplicado
                      </span>
                    )}
                  </div>
                  <Input
                    id="unitPrice"
                    type="number"
                    step={500}
                    placeholder={String(activeUnitPrice)}
                    value={isCustomPrice ? unitPriceInput : activeUnitPrice}
                    onChange={(e) => {
                      setIsCustomPrice(true);
                      setUnitPriceInput(e.target.value);
                    }}
                    className="h-9 text-xs font-bold text-emerald-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAddItem}
                    className="bg-primary/20 hover:bg-primary/30 border-primary/30 h-9 w-full gap-1.5 border text-xs font-semibold text-white"
                  >
                    <Plus className="size-3.5" />
                    Agregar
                  </Button>
                </div>
              </div>

              {/* Subtotal Calculation Display */}
              <div className="flex items-center justify-between pt-1 text-xs border-t border-white/5">
                <span className="text-muted">Subtotal de este ítem ({quantity} unid):</span>
                <span className="font-extrabold text-white text-sm">
                  {currency(itemTotal)}
                </span>
              </div>
            </div>

            {/* List of Added Items in Cart */}
            <div className="space-y-2 rounded-2xl border border-white/10 bg-black/20 p-3">
              <div className="flex items-center justify-between">
                <span className="text-muted flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
                  <ShoppingCart className="size-3.5" />
                  Desglose de la Venta ({items.length} ítems)
                </span>
                {items.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted h-6 px-2 text-[11px] hover:text-white"
                    onClick={() => setItems([])}
                  >
                    Limpiar lista
                  </Button>
                )}
              </div>

              {items.length === 0 ? (
                <div className="text-muted rounded-xl border border-dashed border-white/10 bg-white/2 p-4 text-center text-xs">
                  Agrega botellas con sus respectivos sabores usando el panel
                  superior.
                </div>
              ) : (
                <div className="max-h-[140px] space-y-2 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 p-2 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate font-semibold text-white">
                            {item.quantity}x {item.variantLabel}
                          </p>
                          {item.isWholesale && (
                            <Badge
                              variant="success"
                              className="px-1 py-0 text-[9px] font-bold"
                            >
                              🏷️ Mayorista
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted truncate text-[11px]">
                          Sabor:{" "}
                          <span className="text-primary font-medium">
                            {item.flavorName}
                          </span>
                          {" · "}
                          {currency(item.unitPrice)} c/u
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {currency(item.total)}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-muted size-6 hover:text-red-400"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Customer & Notes Optional Details */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="customerName" className="text-xs">
                  Cliente / Comprador
                </Label>
                <Input
                  id="customerName"
                  placeholder="Ej: Bar Central / Juan"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="notes" className="text-xs">
                  Notas / Observaciones
                </Label>
                <Input
                  id="notes"
                  placeholder="Ej: Factura #104"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Fixed Summary Panel & Submit Button */}
          <div className="mt-1 flex flex-col items-stretch justify-between gap-3 border-t border-white/10 bg-[#0f071a] pt-3 sm:flex-row sm:items-center">
            <div className="flex items-center justify-between sm:block">
              <div className="flex items-center gap-1.5">
                <Badge
                  variant="secondary"
                  className="py-0.5 text-[10px] sm:text-xs"
                >
                  {totalBottles} botellas
                </Badge>
                <Badge
                  variant="muted"
                  className="py-0.5 text-[10px] sm:text-xs"
                >
                  {totalLiters}L proyectados
                </Badge>
              </div>
              <p className="text-muted mt-1 text-[11px] sm:text-xs">
                Total Venta:{" "}
                <span className="text-sm font-extrabold text-white sm:text-base">
                  {currency(grandTotal || quantity * activeUnitPrice)}
                </span>
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="h-10 w-full justify-center gap-2 px-4 text-xs font-bold shadow-[0_0_20px_rgba(255,79,216,0.3)] sm:w-auto sm:px-6 sm:text-sm"
            >
              {isSubmitting
                ? "Registrando..."
                : `Registrar Venta (${currency(grandTotal || quantity * activeUnitPrice)})`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
