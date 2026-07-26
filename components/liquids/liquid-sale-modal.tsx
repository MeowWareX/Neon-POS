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
import { ScrollArea } from "@/components/ui/scroll-area";
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
    toast.success(
      `Añadido: ${quantity}x ${currentConfig.label} (${finalFlavorName})`,
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

      <DialogContent className="flex max-h-[92vh] max-w-2xl flex-col border-white/10 bg-[#0f071a]/95 p-6 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <FlaskConical className="text-primary size-5" />
            Registrar Venta de Líquidos Concentrados
          </DialogTitle>
          <DialogDescription>
            Agrega múltiples botellas de distintos sabores en una sola
            transacción comercial.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="mt-2 flex min-h-0 flex-1 flex-col gap-4"
        >
          {/* Header Controls: Date & Payment Method */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="saleDate">Fecha Comercial</Label>
              <Input
                id="saleDate"
                type="date"
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="paymentMethod">Método de Pago</Label>
              <Select
                value={paymentMethod}
                onValueChange={(val) => setPaymentMethod(val as PaymentMethod)}
              >
                <SelectTrigger id="paymentMethod">
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
          <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                Seleccionar Producto y Sabor
              </span>
              <Badge variant="secondary" className="text-[11px]">
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
                      <span className="text-xs font-bold">
                        {itemConfig.label}
                      </span>
                      {itemConfig.hasAlcohol && (
                        <Badge
                          variant="warning"
                          className="px-1 py-0 text-[9px]"
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

            {/* Flavor & Quantity Controls */}
            <div className="grid grid-cols-1 items-end gap-3 pt-1 md:grid-cols-[1fr_120px_auto]">
              <div className="space-y-1.5">
                <Label htmlFor="flavor">Sabor del Líquido</Label>
                <Select value={flavorId} onValueChange={setFlavorId}>
                  <SelectTrigger id="flavor">
                    <SelectValue placeholder="Seleccionar sabor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin sabor específico</SelectItem>
                    {flavors.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">
                      ✏️ Escribir otro sabor...
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {flavorId === "custom" ? (
                <div className="space-y-1.5 md:col-span-3">
                  <Label htmlFor="customFlavor">
                    Nombre del Sabor Personalizado
                  </Label>
                  <Input
                    id="customFlavor"
                    placeholder="Ej: Fresa, Uva, Maracuyá..."
                    value={customFlavor}
                    onChange={(e) => setCustomFlavor(e.target.value)}
                  />
                </div>
              ) : null}

              <div className="space-y-1.5">
                <Label htmlFor="quantity">Cantidad</Label>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Number(e.target.value)))
                  }
                />
              </div>

              <Button
                type="button"
                variant="secondary"
                onClick={handleAddItem}
                className="bg-primary/20 hover:bg-primary/30 border-primary/30 gap-1.5 border font-semibold text-white"
              >
                <Plus className="size-4" />
                Agregar
              </Button>
            </div>
          </div>

          {/* List of Added Items in Cart */}
          <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-muted flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
                <ShoppingCart className="size-3.5" />
                Desglose de la Venta ({items.length} ítems)
              </span>
              {items.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted h-6 text-xs hover:text-white"
                  onClick={() => setItems([])}
                >
                  Limpiar lista
                </Button>
              )}
            </div>

            {items.length === 0 ? (
              <div className="text-muted flex flex-1 items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/2 p-6 text-center text-sm">
                Agrega botellas con sus respectivos sabores usando el panel
                superior.
              </div>
            ) : (
              <ScrollArea className="max-h-[180px] flex-1 pr-2">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-2.5 text-sm"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-white">
                          {item.quantity}x {item.variantLabel}
                        </p>
                        <p className="text-muted truncate text-xs">
                          Sabor:{" "}
                          <span className="text-primary font-medium">
                            {item.flavorName}
                          </span>
                          {" · "}
                          {currency(item.unitPrice)} c/u
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white">
                          {currency(item.total)}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-muted size-7 hover:text-red-400"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Customer & Notes Optional Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="customerName" className="text-xs">
                Cliente / Comprador
              </Label>
              <Input
                id="customerName"
                placeholder="Ej: Bar Central / Juan"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="h-9 text-xs"
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
                className="h-9 text-xs"
              />
            </div>
          </div>

          {/* Summary Panel & Submit Button */}
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{totalBottles} botellas</Badge>
                <Badge variant="muted">{totalLiters}L proyectados</Badge>
              </div>
              <p className="text-muted mt-1 text-xs">
                Total Venta:{" "}
                <span className="text-base font-extrabold text-white">
                  {currency(grandTotal || quantity * currentUnitPrice)}
                </span>
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="gap-2 px-6 font-bold shadow-[0_0_20px_rgba(255,79,216,0.3)]"
            >
              {isSubmitting
                ? "Registrando..."
                : `Registrar Venta (${currency(grandTotal || quantity * currentUnitPrice)})`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
