"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getBusinessDate } from "@/lib/business";
import { CATALOG_UPDATE_KEY } from "@/lib/constants";
import { useAppStore } from "@/stores/app-store";
import type { ActiveFlavor, Flavor } from "@/types/domain";
import { toast } from "sonner";

export function ActiveFlavorManager() {
  const [flavors, setFlavors] = useState<Flavor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFlavors, setSelectedFlavors] = useState<{
    tank1: string;
    tank2: string;
    tank3: string;
  }>({
    tank1: "",
    tank2: "",
    tank3: "",
  });

  const businessDate = getBusinessDate();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [flavorsRes, activeFlavorsRes] = await Promise.all([
        fetch("/api/configuration/flavors"),
        fetch("/api/active-flavors"),
      ]);

      if (flavorsRes.ok) {
        const data = await flavorsRes.json();
        const activeFlavors = data.filter((f: Flavor) => f.isActive);
        setFlavors(activeFlavors);
      }

      if (activeFlavorsRes.ok) {
        const data: ActiveFlavor[] = await activeFlavorsRes.json();
        const targetDate = businessDate.slice(0, 10);
        const todayActive = data.filter(
          (af: ActiveFlavor) =>
            (af.businessDate || "").slice(0, 10) === targetDate,
        );

        const activeList = todayActive.length > 0 ? todayActive : data;

        const tank1 =
          activeList.find((af) => af.tankNumber === 1)?.flavorId || "";
        const tank2 =
          activeList.find((af) => af.tankNumber === 2)?.flavorId || "";
        const tank3 =
          activeList.find((af) => af.tankNumber === 3)?.flavorId || "";
        setSelectedFlavors({ tank1, tank2, tank3 });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [businessDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleSave() {
    setIsLoading(true);
    try {
      const promises: Promise<Response>[] = [];

      if (selectedFlavors.tank1) {
        promises.push(
          fetch("/api/active-flavors", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              flavorId: selectedFlavors.tank1,
              tankNumber: 1,
              businessDate,
            }),
          }),
        );
      }

      if (selectedFlavors.tank2) {
        promises.push(
          fetch("/api/active-flavors", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              flavorId: selectedFlavors.tank2,
              tankNumber: 2,
              businessDate,
            }),
          }),
        );
      }

      if (selectedFlavors.tank3) {
        promises.push(
          fetch("/api/active-flavors", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              flavorId: selectedFlavors.tank3,
              tankNumber: 3,
              businessDate,
            }),
          }),
        );
      }

      await Promise.all(promises);

      // Update local store activeFlavors
      const { setFlavorTank } = useAppStore.getState();
      if (selectedFlavors.tank1) setFlavorTank(selectedFlavors.tank1, 1);
      if (selectedFlavors.tank2) setFlavorTank(selectedFlavors.tank2, 2);
      if (selectedFlavors.tank3) setFlavorTank(selectedFlavors.tank3, 3);

      await fetchData();
      toast.success("Sabores asignados correctamente a los tanques.");
      localStorage.setItem(CATALOG_UPDATE_KEY, Date.now().toString());
      window.dispatchEvent(new Event("catalog-updated"));
    } catch (error) {
      console.error("Error saving flavors:", error);
      toast.error("Error al guardar sabores activos");
    } finally {
      setIsLoading(false);
    }
  }

  const getTankLabel = (tankNumber: 1 | 2 | 3) => {
    const labels = {
      1: "Tanque 1",
      2: "Tanque 2",
      3: "Tanque 3",
    };
    return labels[tankNumber];
  };

  return (
    <div className="mx-auto w-full max-w-4xl p-0">
      <Card className="bg-card/80 border-white/10 backdrop-blur">
        <CardHeader>
          <CardTitle>Asignación de tanques</CardTitle>
          <p className="text-muted text-sm">
            Fecha: {new Date(businessDate).toLocaleDateString("es-CO")}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {([1, 2, 3] as const).map((tank) => (
            <div key={tank} className="space-y-2">
              <Label
                htmlFor={`tank-${tank}`}
                className="text-foreground text-base font-semibold"
              >
                {getTankLabel(tank)}
              </Label>
              <Select
                value={
                  selectedFlavors[`tank${tank}` as keyof typeof selectedFlavors]
                }
                onValueChange={(value) =>
                  setSelectedFlavors({
                    ...selectedFlavors,
                    [`tank${tank}`]: value,
                  })
                }
              >
                <SelectTrigger id={`tank-${tank}`}>
                  <SelectValue placeholder="Selecciona un sabor" />
                </SelectTrigger>
                <SelectContent>
                  {flavors.map((flavor) => (
                    <SelectItem key={flavor.id} value={flavor.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: flavor.color }}
                        />
                        {flavor.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}

          <div className="pt-2">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Guardando..." : "Guardar Sabores"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
