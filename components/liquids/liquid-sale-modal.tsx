"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FlaskConical, Plus } from "lucide-react";
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

export function LiquidSaleModal({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const businessDate = useAppStore((state) => state.businessDate);
  const flavors = useAppStore((state) => state.flavors);
  const addLiquidSale = useAppStore((state) => state.addLiquidSale);

  const [saleDate, setSaleDate] = useState<string>(businessDate);
  const [variant, setVariant] = useState<LiquidVariantCode>("base_sin_licor");
  const [flavorId, setFlavorId] = useState<string>("none");
  const [quantity, setQuantity] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [customerName, setCustomerName] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const config = LIQUID_VARIANT_CONFIG[variant];
  const unitPrice = config?.price ?? 0;
  const totalAmount = unitPrice * quantity;
  const totalLiters = quantity * LIQUID_YIELD_LITERS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) {
      toast.error("La cantidad debe ser mayor a 0");
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedFlavor = flavors.find((f) => f.id === flavorId);

      addLiquidSale({
        saleDate,
        variant,
        flavorId: flavorId !== "none" ? flavorId : null,
        flavorName: selectedFlavor ? selectedFlavor.name : null,
        quantity,
        paymentMethod,
        customerName: customerName.trim() || null,
        notes: notes.trim() || null,
      });

      toast.success(
        `Venta registrada: ${quantity}x ${config.label} (${currency(totalAmount)})`,
      );

      // Reset form
      setQuantity(1);
      setCustomerName("");
      setNotes("");
      setOpen(false);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Error al registrar venta",
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
            Nueva Venta de Líquido
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-lg border-white/10 bg-[#0f071a]/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <FlaskConical className="text-primary size-5" />
            Registrar Venta de Líquido Concentrado
          </DialogTitle>
          <DialogDescription>
            Ingresa la venta de botellas concentradas (Rendimiento: 6 Litros por
            unidad).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-3 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="saleDate">Fecha de Venta</Label>
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

          <div className="space-y-1.5">
            <Label htmlFor="variant">Variante de Producto</Label>
            <div className="grid grid-cols-2 gap-2">
              {LIQUID_VARIANTS.map((vKey) => {
                const item = LIQUID_VARIANT_CONFIG[vKey];
                const isSelected = variant === vKey;
                return (
                  <button
                    key={vKey}
                    type="button"
                    onClick={() => setVariant(vKey)}
                    className={`flex flex-col items-start rounded-2xl border p-3 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/15 text-white shadow-[0_0_15px_rgba(255,79,216,0.3)]"
                        : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="text-xs font-bold">{item.label}</span>
                      {item.hasAlcohol && (
                        <Badge
                          variant="warning"
                          className="px-1.5 py-0 text-[10px]"
                        >
                          Licor
                        </Badge>
                      )}
                    </div>
                    <span className="text-primary mt-1 text-sm font-extrabold">
                      {currency(item.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="flavor">Sabor (Opcional)</Label>
              <Select value={flavorId} onValueChange={setFlavorId}>
                <SelectTrigger id="flavor">
                  <SelectValue placeholder="Sabor concentrado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin sabor específico</SelectItem>
                  {flavors.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="quantity">Cantidad (Unidades/Botellas)</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value)))
                }
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="customerName">Cliente / Comprador (Opcional)</Label>
            <Input
              id="customerName"
              placeholder="Ej: Bar Central / Juan Pérez"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notas o Observaciones (Opcional)</Label>
            <Input
              id="notes"
              placeholder="Ej: Entregado con factura #104"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="glass-panel mt-2 rounded-2xl border border-white/10 p-3">
            <div className="text-muted flex items-center justify-between text-xs">
              <span>Precio Unitario:</span>
              <span className="font-semibold text-white">
                {currency(unitPrice)}
              </span>
            </div>
            <div className="text-muted mt-1 flex items-center justify-between text-xs">
              <span>Rendimiento Proyectado:</span>
              <span className="text-secondary font-semibold">
                {totalLiters} Litros
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2 text-sm">
              <span className="font-bold text-white">Total Venta:</span>
              <span className="font-display text-primary text-xl font-extrabold tracking-wide">
                {currency(totalAmount)}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="font-semibold"
            >
              {isSubmitting ? "Guardando..." : "Registrar Venta"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
