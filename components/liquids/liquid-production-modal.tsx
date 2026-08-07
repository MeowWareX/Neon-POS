"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import { LIQUID_VARIANT_CONFIG, LIQUID_VARIANTS, LiquidVariantCode } from "@/lib/constants";
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

export function LiquidProductionModal({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const flavors = useAppStore((state) => state.flavors);
  const addLiquidProduction = useAppStore((state) => state.addLiquidProduction);

  const [flavorId, setFlavorId] = useState<string>("none");
  const [customFlavor, setCustomFlavor] = useState<string>("");
  const [variant, setVariant] = useState<string>("none");
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalFlavorName = "";
    let finalFlavorId: string | null = null;

    if (flavorId === "custom") {
      finalFlavorName = customFlavor.trim();
      if (!finalFlavorName) {
        toast.error("Por favor especifica el nombre del sabor personalizado");
        return;
      }
    } else if (flavorId !== "none") {
      const selected = flavors.find((f) => f.id === flavorId);
      finalFlavorName = selected ? selected.name : "Sabor Específico";
      finalFlavorId = flavorId;
    } else {
      toast.error("Por favor selecciona un sabor para la producción");
      return;
    }

    if (quantity <= 0) {
      toast.error("La cantidad producida debe ser al menos 1 bolsa");
      return;
    }

    setIsSubmitting(true);
    try {
      addLiquidProduction({
        flavorId: finalFlavorId,
        flavorName: finalFlavorName,
        variant: variant !== "none" ? (variant as LiquidVariantCode) : null,
        quantity,
        notes: notes.trim() || undefined,
      });

      toast.success(
        `Registradas +${quantity} bolsa(s) de ${finalFlavorName} en stock`,
      );
      setOpen(false);
      // Reset form
      setQuantity(1);
      setNotes("");
      setCustomFlavor("");
    } catch (err) {
      console.error(err);
      toast.error("Error al registrar la producción");
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
            className="w-full sm:w-auto justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-medium gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            <PlusCircle className="size-4" />
            + Entrada Producción
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="glass-panel border-white/20 bg-slate-950/90 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-emerald-400">
            <PlusCircle className="size-5" />
            Registrar Producción de Bolsas
          </DialogTitle>
          <DialogDescription className="text-muted text-xs">
            Añade bolsas de líquido concentrado producidas al inventario en stock.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Flavor selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-white">Sabor del Líquido *</Label>
            <Select value={flavorId} onValueChange={setFlavorId}>
              <SelectTrigger className="border-white/10 bg-white/5 text-white">
                <SelectValue placeholder="Selecciona un sabor" />
              </SelectTrigger>
              <SelectContent className="border-white/15 bg-slate-900 text-white">
                <SelectItem value="none">-- Seleccionar sabor --</SelectItem>
                {flavors.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.name}
                  </SelectItem>
                ))}
                <SelectItem value="custom">+ Sabor Personalizado / Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {flavorId === "custom" && (
            <div className="space-y-1.5">
              <Label className="text-xs text-white">Nombre del Sabor Personalizado *</Label>
              <Input
                value={customFlavor}
                onChange={(e) => setCustomFlavor(e.target.value)}
                placeholder="Ej. Maracuyá Espacial, Lulo Menta"
                className="border-white/10 bg-white/5 text-white"
              />
            </div>
          )}

          {/* Optional Variant selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-white">Variante (Opcional)</Label>
            <Select value={variant} onValueChange={setVariant}>
              <SelectTrigger className="border-white/10 bg-white/5 text-white">
                <SelectValue placeholder="Variante asociada (opcional)" />
              </SelectTrigger>
              <SelectContent className="border-white/15 bg-slate-900 text-white">
                <SelectItem value="none">General / No especificada</SelectItem>
                {LIQUID_VARIANTS.map((vKey) => (
                  <SelectItem key={vKey} value={vKey}>
                    {LIQUID_VARIANT_CONFIG[vKey].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-white">Cantidad de Bolsas Producidas *</Label>
            <Input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="border-white/10 bg-white/5 text-white text-lg font-bold"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className="text-xs text-white">Notas / Número de Lote (Opcional)</Label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Lote 07-Ago, Producción mañana"
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
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
            >
              Añadir al Stock
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
