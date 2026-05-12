"use client";

import { CupSoda } from "lucide-react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { syncActiveFlavor } from "@/services/admin-sync-service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/stores/app-store";

export function FlavorManager() {
  const { businessDate, flavors, activeFlavors, setFlavorTank } = useAppStore(
    useShallow((state) => ({
      businessDate: state.businessDate,
      flavors: state.flavors,
      activeFlavors: state.activeFlavors,
      setFlavorTank: state.setFlavorTank,
    })),
  );

  const activeMap = new Map(
    activeFlavors
      .filter((item) => item.businessDate === businessDate)
      .map((item) => [item.tankNumber, item.flavorId]),
  );

  const handleTankChange = (tank: 1 | 2 | 3, value: string) => {
    const currentFlavorId = activeMap.get(tank);

    if (value === "none") {
      if (!currentFlavorId) {
        return;
      }

      setFlavorTank(currentFlavorId, null);
      toast.success(`Tanque ${tank} liberado.`);

      if (navigator.onLine) {
        void syncActiveFlavor({
          flavorId: currentFlavorId,
          tankNumber: null,
          businessDate,
        }).catch(() => {
          toast.warning(
            "El cambio quedó guardado localmente. La sincronización remota falló.",
          );
        });
      }

      return;
    }

    setFlavorTank(value, tank);
    toast.success(`Tanque ${tank} actualizado.`);

    if (navigator.onLine) {
      void syncActiveFlavor({
        flavorId: value,
        tankNumber: tank,
        businessDate,
      }).catch(() => {
        toast.warning(
          "El cambio quedó guardado localmente. La sincronización remota falló.",
        );
      });
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <Card>
        <CardHeader>
          <CardTitle>Tanques del día</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {[1, 2, 3].map((tank) => (
            <div
              key={tank}
              className="rounded-[1.5rem] border border-white/10 bg-white/4 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">Tanque {tank}</p>
                  <p className="text-muted text-sm">
                    Sabores activos para la jornada
                  </p>
                </div>
                <Badge variant="secondary">
                  {flavors.find(
                    (item) => item.id === activeMap.get(tank as 1 | 2 | 3),
                  )?.name ?? "Sin asignar"}
                </Badge>
              </div>

              <div className="mt-4">
                <Select
                  value={activeMap.get(tank as 1 | 2 | 3) ?? "none"}
                  onValueChange={(value) =>
                    handleTankChange(tank as 1 | 2 | 3, value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona sabor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin asignar</SelectItem>
                    {flavors.map((flavor) => (
                      <SelectItem key={flavor.id} value={flavor.id}>
                        {flavor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Catálogo de sabores</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {flavors.map((flavor) => {
            const tank = [...activeMap.entries()].find(
              ([, flavorId]) => flavorId === flavor.id,
            )?.[0];
            return (
              <div
                key={flavor.id}
                className="rounded-[1.5rem] border border-white/10 bg-white/4 p-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="size-4 rounded-full"
                    style={{ backgroundColor: flavor.color }}
                  />
                  <p className="font-semibold">{flavor.name}</p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <Badge variant={tank ? "success" : "muted"}>
                    {tank ? `Tanque ${tank}` : "No activo"}
                  </Badge>
                  <CupSoda className="text-secondary size-4" />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
