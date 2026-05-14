"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/common/empty-state";
import { getLowStockItems } from "@/lib/analytics";
import { currency, formatDateTime } from "@/lib/utils";
import { purchaseSchema, inventoryMovementSchema } from "@/schemas/inventory";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Boxes, RefreshCw } from "lucide-react";
import type { InventoryItem } from "@/types/domain";

export function InventoryOverview() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const movementForm = useForm({
    resolver: zodResolver(inventoryMovementSchema),
    defaultValues: {
      inventoryItemId: "",
      type: "adjustment" as const,
      quantity: 1,
      note: "",
    },
  });

  const purchaseForm = useForm({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      inventoryItemId: "",
      vendor: "",
      quantity: 1,
      total: 0,
      note: "",
    },
  });

  const loadInventoryFromBD = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/inventory/items");
      if (!response.ok) throw new Error("Failed to load inventory");
      const data = await response.json();
      setInventoryItems(data);
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Error loading inventory:", error);
      toast.error("No se pudo cargar el inventario");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInventoryFromBD();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadInventoryFromBD, 30000);
    return () => clearInterval(interval);
  }, []);

  const lowStock = getLowStockItems(inventoryItems);

  return (
    <div className="space-y-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Inventario en tiempo real</h2>
        <Button
          size="sm"
          variant="outline"
          onClick={loadInventoryFromBD}
          disabled={isLoading}
        >
          <RefreshCw
            className={`mr-2 size-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Actualizar
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-muted text-sm">Items activos</p>
            <p className="mt-3 text-3xl font-semibold">
              {inventoryItems.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-muted text-sm">Alertas de stock</p>
            <p className="mt-3 text-3xl font-semibold">{lowStock.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-muted text-sm">Última actualización</p>
            <p className="text-muted mt-3 text-sm">
              {formatDateTime(lastRefresh)}
            </p>
          </CardContent>
        </Card>
      </div>

      {lowStock.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {lowStock.map((item) => (
            <Card key={item.id} className="border-amber-400/20">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{item.name}</p>
                  <AlertTriangle className="size-4 text-amber-300" />
                </div>
                <p className="mt-3 text-2xl font-semibold">
                  {item.currentStock}
                </p>
                <p className="text-muted text-sm">
                  Mínimo: {item.reorderPoint}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      <Tabs defaultValue="stock">
        <TabsList>
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="movement">Ajustes</TabsTrigger>
          <TabsTrigger value="purchase">Compras</TabsTrigger>
        </TabsList>

        <TabsContent className="mt-5" value="stock">
          {isLoading ? (
            <div className="text-muted py-8 text-center">Cargando...</div>
          ) : inventoryItems.length === 0 ? (
            <EmptyState
              icon={Boxes}
              title="Sin items registrados"
              description="Crea items de inventario desde configuración."
            />
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {inventoryItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-muted text-sm">{item.category}</p>
                      </div>
                      <Badge
                        variant={
                          item.currentStock <= item.reorderPoint
                            ? "warning"
                            : "success"
                        }
                      >
                        {item.currentStock} {item.unit}
                      </Badge>
                    </div>
                    <p className="text-muted mt-4 text-sm">Costo unitario</p>
                    <p className="text-lg font-semibold">
                      {currency(item.unitCost)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent className="mt-5" value="movement">
          <Card>
            <CardHeader>
              <CardTitle>Registrar ajuste</CardTitle>
              <p className="text-muted mt-1 text-sm">
                Los movimientos se guardan directamente en la BD
              </p>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={movementForm.handleSubmit(async (values) => {
                  try {
                    const response = await fetch("/api/inventory/movements", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(values),
                    });
                    if (!response.ok)
                      throw new Error("Failed to save movement");
                    toast.success("Movimiento registrado en BD");
                    movementForm.reset();
                    await loadInventoryFromBD();
                  } catch (error) {
                    console.error("Error saving movement:", error);
                    toast.error("Error al guardar el movimiento");
                  }
                })}
              >
                <div className="space-y-4">
                  <div>
                    <Label>Item</Label>
                    <Select
                      value={movementForm.watch("inventoryItemId")}
                      onValueChange={(value) =>
                        movementForm.setValue("inventoryItemId", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona item" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventoryItems.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Tipo</Label>
                    <Select
                      value={movementForm.watch("type")}
                      onValueChange={(value) =>
                        movementForm.setValue(
                          "type",
                          value as "purchase" | "adjustment" | "waste",
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adjustment">
                          Ajuste positivo
                        </SelectItem>
                        <SelectItem value="purchase">Ingreso manual</SelectItem>
                        <SelectItem value="waste">Merma</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Cantidad</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      {...movementForm.register("quantity", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>

                  <div>
                    <Label>Nota</Label>
                    <Input
                      placeholder="Motivo del ajuste"
                      {...movementForm.register("note")}
                    />
                  </div>
                </div>

                <Button className="mt-4 w-full" type="submit">
                  Guardar movimiento
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className="mt-5" value="purchase">
          <Card>
            <CardHeader>
              <CardTitle>Registrar compra</CardTitle>
              <p className="text-muted mt-1 text-sm">
                Las compras se guardan directamente en la BD
              </p>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={purchaseForm.handleSubmit(async (values) => {
                  try {
                    const response = await fetch("/api/purchases", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(values),
                    });
                    if (!response.ok)
                      throw new Error("Failed to save purchase");
                    toast.success("Compra registrada en BD");
                    purchaseForm.reset();
                    await loadInventoryFromBD();
                  } catch (error) {
                    console.error("Error saving purchase:", error);
                    toast.error("Error al guardar la compra");
                  }
                })}
              >
                <div className="space-y-4">
                  <div>
                    <Label>Item</Label>
                    <Select
                      value={purchaseForm.watch("inventoryItemId")}
                      onValueChange={(value) =>
                        purchaseForm.setValue("inventoryItemId", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona item" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventoryItems.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Proveedor</Label>
                    <Input
                      placeholder="Nombre proveedor"
                      {...purchaseForm.register("vendor")}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Cantidad</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        {...purchaseForm.register("quantity", {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                    <div>
                      <Label>Total</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        {...purchaseForm.register("total", {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Nota</Label>
                    <Input
                      placeholder="Notas adicionales"
                      {...purchaseForm.register("note")}
                    />
                  </div>
                </div>

                <Button className="mt-4 w-full" type="submit">
                  Guardar compra
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
