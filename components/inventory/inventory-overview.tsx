"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { EmptyState } from "@/components/common/empty-state";
import {
  syncInventoryMovement,
  syncPurchase,
} from "@/services/admin-sync-service";
import { getLowStockItems } from "@/lib/analytics";
import { currency, formatDateTime } from "@/lib/utils";
import { purchaseSchema, inventoryMovementSchema } from "@/schemas/inventory";
import { useAppStore } from "@/stores/app-store";
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
import { AlertTriangle, Boxes } from "lucide-react";

export function InventoryOverview() {
  const {
    inventoryItems,
    inventoryMovements,
    purchases,
    addInventoryMovement,
    recordPurchase,
  } = useAppStore(
    useShallow((state) => ({
      inventoryItems: state.inventoryItems,
      inventoryMovements: state.inventoryMovements,
      purchases: state.purchases,
      addInventoryMovement: state.addInventoryMovement,
      recordPurchase: state.recordPurchase,
    })),
  );

  const lowStock = getLowStockItems(inventoryItems);

  const movementForm = useForm({
    resolver: zodResolver(inventoryMovementSchema),
    defaultValues: {
      inventoryItemId: inventoryItems[0]?.id ?? "",
      type: "adjustment" as const,
      quantity: 1,
      note: "",
    },
  });

  const purchaseForm = useForm({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      inventoryItemId: inventoryItems[0]?.id ?? "",
      vendor: "",
      quantity: 1,
      total: 0,
      note: "",
    },
  });

  return (
    <div className="space-y-5">
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
            <p className="text-muted text-sm">Compras registradas</p>
            <p className="mt-3 text-3xl font-semibold">{purchases.length}</p>
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
        </TabsContent>

        <TabsContent className="mt-5" value="movement">
          <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
            <Card>
              <CardHeader>
                <CardTitle>Registrar ajuste</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-4"
                  onSubmit={movementForm.handleSubmit((values) => {
                    const movement = addInventoryMovement(values);
                    movementForm.reset({
                      inventoryItemId: values.inventoryItemId,
                      type: "adjustment",
                      quantity: 1,
                      note: "",
                    });
                    toast.success("Movimiento registrado.");
                    if (navigator.onLine) {
                      void syncInventoryMovement(movement).catch(() => {
                        toast.warning(
                          "Movimiento guardado localmente. La sincronización remota falló.",
                        );
                      });
                    }
                  })}
                >
                  <Field>
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
                  </Field>

                  <Field>
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
                  </Field>

                  <Field>
                    <Label>Cantidad</Label>
                    <Input
                      type="number"
                      {...movementForm.register("quantity")}
                    />
                  </Field>

                  <Field>
                    <Label>Nota</Label>
                    <Input {...movementForm.register("note")} />
                  </Field>

                  <Button className="w-full" type="submit">
                    Guardar movimiento
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Movimientos recientes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {inventoryMovements.map((movement) => (
                  <div
                    key={movement.id}
                    className="rounded-[1.3rem] border border-white/10 bg-white/4 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">
                        {
                          inventoryItems.find(
                            (item) => item.id === movement.inventoryItemId,
                          )?.name
                        }
                      </p>
                      <Badge
                        variant={movement.quantity < 0 ? "warning" : "success"}
                      >
                        {movement.quantity}
                      </Badge>
                    </div>
                    <p className="text-muted mt-2 text-sm">{movement.note}</p>
                    <p className="text-muted mt-2 text-xs">
                      {formatDateTime(movement.createdAt)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent className="mt-5" value="purchase">
          <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
            <Card>
              <CardHeader>
                <CardTitle>Registrar compra</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-4"
                  onSubmit={purchaseForm.handleSubmit((values) => {
                    const purchase = recordPurchase(values);
                    purchaseForm.reset({
                      inventoryItemId: values.inventoryItemId,
                      vendor: "",
                      quantity: 1,
                      total: 0,
                      note: "",
                    });
                    toast.success("Compra registrada.");
                    if (navigator.onLine) {
                      void syncPurchase(purchase).catch(() => {
                        toast.warning(
                          "Compra guardada localmente. La sincronización remota falló.",
                        );
                      });
                    }
                  })}
                >
                  <Field>
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
                  </Field>
                  <Field>
                    <Label>Proveedor</Label>
                    <Input {...purchaseForm.register("vendor")} />
                  </Field>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field>
                      <Label>Cantidad</Label>
                      <Input
                        type="number"
                        {...purchaseForm.register("quantity")}
                      />
                    </Field>
                    <Field>
                      <Label>Total</Label>
                      <Input
                        type="number"
                        {...purchaseForm.register("total")}
                      />
                    </Field>
                  </div>
                  <Field>
                    <Label>Nota</Label>
                    <Input {...purchaseForm.register("note")} />
                  </Field>
                  <Button className="w-full" type="submit">
                    Guardar compra
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compras recientes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {purchases.length === 0 ? (
                  <EmptyState
                    icon={Boxes}
                    title="Sin compras registradas"
                    description="Cuando registres abastecimientos aparecerán aquí."
                  />
                ) : (
                  purchases.map((purchase) => (
                    <div
                      key={purchase.id}
                      className="rounded-[1.3rem] border border-white/10 bg-white/4 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{purchase.vendor}</p>
                          <p className="text-muted text-sm">
                            {
                              inventoryItems.find(
                                (item) => item.id === purchase.inventoryItemId,
                              )?.name
                            }
                          </p>
                        </div>
                        <p className="font-semibold">
                          {currency(purchase.total)}
                        </p>
                      </div>
                      <p className="text-muted mt-2 text-sm">
                        {purchase.quantity} unidades
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
