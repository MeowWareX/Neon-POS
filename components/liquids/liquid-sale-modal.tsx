"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FlaskConical, Plus, ShoppingCart, Trash2 } from "lucide-react";
import {
  LIQUID_VARIANT_CONFIG,
  LIQUID_VARIANTS,
  LIQUID_YIELD_LITERS,
  LiquidVariantCode,
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
}

export function LiquidSaleModal({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const businessDate = useAppStore((state) => state.businessDate);
  const flavors = useAppStore((state) => state.flavors);
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

  const currentConfig = LIQUID_VARIANT_CONFIG[variant];
  const currentUnitPrice = currentConfig?.price ?? 0;

  const handleAddItem = () => {
    if (quantity <= 0) {
      toast.error("La cantidad debe ser al menos 1");
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

    const newItem: LiquidDraftItem = {
      id: crypto.randomUUID(),
      variant,
      variantLabel: currentConfig.label,
      flavorId: finalFlavorId,
      flavorName: finalFlavorName,
      quantity,
      unitPrice: currentUnitPrice,
      total: currentUnitPrice * quantity,
    };

    setItems((prev) => [...prev, newItem]);
    setQuantity(1);
    toast.success(`Añadido: ${quantity}x ${currentConfig.label} (${finalFlavorName})`);
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
          unitPrice: currentUnitPrice,
          total: currentUnitPrice * quantity,
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
          <Button className="gap-2 shadow-[0_0_20px_rgba(255,79,216,0.25)]">
            <Plus className="size-4" />
            Nueva Venta de Líquidos
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="flex max-h-[92vh] w-[95vw] sm:w-full max-w-2xl flex-col overflow-hidden border-white/10 bg-[#0f071a]/98 p-4 sm:p-6 backdrop-blur-xl rounded-3xl">
        <DialogHeader className="flex-none pb-2">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl font-bold">
            <FlaskConical className="text-primary size-5 shrink-0" />
            Registrar Venta de Líquidos Concentrados
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Agrega múltiples botellas de distintos sabores en una sola transacción comercial.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden mt-1">
          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto min-h-0 pr-1 sm:pr-2 space-y-4">
            {/* Header Controls: Date & Payment Method */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="saleDate" className="text-xs font-semibold">Fecha Comercial</Label>
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
                <Label htmlFor="paymentMethod" className="text-xs font-semibold">Método de Pago</Label>
                <Select
                  value={paymentMethod}
                  onValueChange={(val) => setPaymentMethod(val as PaymentMethod)}
                >
                  <SelectTrigger id="paymentMethod" className="h-9 text-xs sm:text-sm">
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
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Seleccionar Producto y Sabor
                </span>
                <Badge variant="secondary" className="text-[10px] sm:text-[11px]">
                  {currency(currentUnitPrice)} / botella
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
                      onClick={() => setVariant(vKey)}
                      className={`flex flex-col items-start rounded-xl border p-2.5 text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/20 text-white shadow-[0_0_15px_rgba(255,79,216,0.3)]"
                          : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className="text-xs font-bold truncate">{itemConfig.label}</span>
                        {itemConfig.hasAlcohol && (
                          <Badge variant="warning" className="px-1 py-0 text-[8px] sm:text-[9px] shrink-0 ml-1">
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

              {/* Flavor & Quantity Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px_auto] gap-2.5 items-end pt-1">
                <div className="space-y-1.5">
                  <Label htmlFor="flavor" className="text-xs">Sabor del Líquido</Label>
                  <Select value={flavorId} onValueChange={setFlavorId}>
                    <SelectTrigger id="flavor" className="h-9 text-xs">
                      <SelectValue placeholder="Seleccionar sabor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin sabor específico</SelectItem>
                      {flavors.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">✏️ Escribir otro sabor...</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {flavorId === "custom" ? (
                  <div className="space-y-1.5 sm:col-span-3">
                    <Label htmlFor="customFlavor" className="text-xs">Nombre del Sabor Personalizado</Label>
                    <Input
                      id="customFlavor"
                      placeholder="Ej: Fresa, Uva, Maracuyá..."
                      value={customFlavor}
                      onChange={(e) => setCustomFlavor(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                ) : null}

                <div className="space-y-1.5">
                  <Label htmlFor="quantity" className="text-xs">Cantidad</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="h-9 text-xs"
                  />
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddItem}
                  className="h-9 gap-1.5 bg-primary/20 hover:bg-primary/30 border border-primary/30 text-white font-semibold text-xs"
                >
                  <Plus className="size-3.5" />
                  Agregar
                </Button>
              </div>
            </div>

            {/* List of Added Items in Cart */}
            <div className="rounded-2xl border border-white/10 bg-black/20 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                  <ShoppingCart className="size-3.5" />
                  Desglose de la Venta ({items.length} ítems)
                </span>
                {items.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 text-[11px] text-muted hover:text-white px-2"
                    onClick={() => setItems([])}
                  >
                    Limpiar lista
                  </Button>
                )}
              </div>

              {items.length === 0 ? (
                <div className="p-4 text-center text-muted text-xs border border-dashed border-white/10 rounded-xl bg-white/2">
                  Agrega botellas con sus respectivos sabores usando el panel superior.
                </div>
              ) : (
                <div className="max-h-[140px] overflow-y-auto space-y-2 pr-1">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 p-2 text-xs"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">
                          {item.quantity}x {item.variantLabel}
                        </p>
                        <p className="text-[11px] text-muted truncate">
                          Sabor: <span className="text-primary font-medium">{item.flavorName}</span>
                          {" · "}
                          {currency(item.unitPrice)} c/u
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-bold text-white text-xs">
                          {currency(item.total)}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-6 text-muted hover:text-red-400"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="customerName" className="text-xs">Cliente / Comprador</Label>
                <Input
                  id="customerName"
                  placeholder="Ej: Bar Central / Juan"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="notes" className="text-xs">Notas / Observaciones</Label>
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
          <div className="flex-none pt-3 mt-1 border-t border-white/10 flex items-center justify-between gap-3 bg-[#0f071a]">
            <div>
              <div className="flex items-center gap-1.5">
                <Badge variant="secondary" className="text-[10px] sm:text-xs py-0.5">{totalBottles} botellas</Badge>
                <Badge variant="muted" className="text-[10px] sm:text-xs py-0.5">{totalLiters}L proyectados</Badge>
              </div>
              <p className="text-[11px] sm:text-xs text-muted mt-1">
                Total Venta: <span className="text-sm sm:text-base font-extrabold text-white">{currency(grandTotal || (quantity * currentUnitPrice))}</span>
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="gap-2 shadow-[0_0_20px_rgba(255,79,216,0.3)] font-bold text-xs sm:text-sm px-4 sm:px-6 h-10"
            >
              {isSubmitting ? "Registrando..." : `Registrar Venta (${currency(grandTotal || (quantity * currentUnitPrice))})`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
