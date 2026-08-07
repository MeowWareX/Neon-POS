"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MinusCircle } from "lucide-react";
import { useAppStore } from "@/stores/app-store";
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

export function LiquidAdjustmentModal({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const liquidInventory = useAppStore((state) => state.liquidInventory) || [];
  const recordLiquidAdjustment = useAppStore((state) => state.recordLiquidAdjustment);

  const [inventoryId, setInventoryId] = useState<string>("none");
  const [movementType, setMovementType] = useState<"point_use" | "adjustment" | "waste">("point_use");
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedItem = liquidInventory.find((item) => item.id === inventoryId);
  const maxAvailable = selectedItem ? selectedItem.currentStock : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (inventoryId === "none" || !selectedItem) {
      toast.error("Selecciona el ítem de líquido a descontar");
      return;
    }

    if (quantity <= 0) {
      toast.error("La cantidad a descontar debe ser al menos 1 bolsa");
      return;
    }

    if (quantity > maxAvailable) {
      toast.error(
        `Solo hay ${maxAvailable} bolsa(s) en stock para ${selectedItem.flavorName}`,
      );
      return;
    }

    setIsSubmitting(true);
    try {
      recordLiquidAdjustment({
        liquidInventoryId: inventoryId,
        movementType,
        quantity,
        notes: notes.trim() || undefined,
      });

      const actionText =
        movementType === "point_use"
          ? "Uso en punto / Granizadora"
          : movementType === "waste"
            ? "Merma/Deterioro"
            : "Ajuste manual";

      toast.success(
        `Descontada(s) ${quantity} bolsa(s) de ${selectedItem.flavorName} (${actionText})`,
      );
      setOpen(false);
      setQuantity(1);
      setNotes("");
    } catch (err) {
      console.error(err);
      toast.error("Error al registrar la salida de stock");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            size="sm"
            variant="outline"
            className="w-full sm:w-auto justify-center border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 font-medium gap-1.5"
          >
            <MinusCircle className="size-4" />
            - Uso en Punto / Ajuste
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="glass-panel border-white/20 bg-slate-950/90 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-amber-400">
            <MinusCircle className="size-5" />
            Descontar Bolsas del Stock
          </DialogTitle>
          <DialogDescription className="text-muted text-xs">
            Registra la salida de bolsas por consumo en el punto (refil de máquinas), mermas o ajustes no comerciales.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Stock Item Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-white">Líquido en Stock *</Label>
            <Select value={inventoryId} onValueChange={setInventoryId}>
              <SelectTrigger className="border-white/10 bg-white/5 text-white">
                <SelectValue placeholder="Selecciona el sabor disponible" />
              </SelectTrigger>
              <SelectContent className="border-white/15 bg-slate-900 text-white">
                <SelectItem value="none">-- Seleccionar de la lista --</SelectItem>
                {liquidInventory.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.flavorName} ({item.currentStock} bolsas disponibles)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedItem && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs flex items-center justify-between">
              <span className="text-muted">Stock Actual Disponible:</span>
              <span className="font-bold text-emerald-400 text-sm">
                {selectedItem.currentStock} bolsas
              </span>
            </div>
          )}

          {/* Reason */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-white">Motivo de Salida *</Label>
            <Select
              value={movementType}
              onValueChange={(val) =>
                setMovementType(val as "point_use" | "adjustment" | "waste")
              }
            >
              <SelectTrigger className="border-white/10 bg-white/5 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-white/15 bg-slate-900 text-white">
                <SelectItem value="point_use">
                  🧃 Uso en Punto / Carga Granizadora
                </SelectItem>
                <SelectItem value="waste">
                  ⚠️ Merma / Deterioro / Daño
                </SelectItem>
                <SelectItem value="adjustment">
                  🔧 Ajuste Manual de Inventario
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-white">Cantidad a Descontar (Bolsas) *</Label>
            <Input
              type="number"
              min={1}
              max={maxAvailable > 0 ? maxAvailable : 999}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="border-white/10 bg-white/5 text-white text-lg font-bold"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className="text-xs text-white">Detalle / Nota de la Salida</Label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Carga de granizadora tanque 1, prueba de calidad"
              className="border-white/10 bg-white/5 text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-white/10 text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || inventoryId === "none"}
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold"
            >
              Confirmar Descuento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
