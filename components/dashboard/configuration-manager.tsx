"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  Extra,
  Flavor,
  ProductSize,
  ProductType,
} from "@/schemas/configuration";

type TabType = "sizes" | "types" | "extras" | "flavors";

export function ConfigurationManager() {
  const [activeTab, setActiveTab] = useState<TabType>("sizes");
  const [sizes, setSizes] = useState<ProductSize[]>([]);
  const [types, setTypes] = useState<ProductType[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [flavors, setFlavors] = useState<Flavor[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [sizeForm, setSizeForm] = useState({
    code: "",
    label: "",
    ounces: 0,
    price: 0,
    baseCost: 0,
  });
  const [typeForm, setTypeForm] = useState({
    code: "",
    label: "",
    priceModifier: 0,
    costModifier: 0,
  });
  const [extraForm, setExtraForm] = useState({ name: "", price: 0, cost: 0 });
  const [flavorForm, setFlavorForm] = useState({
    name: "",
    color: "#ff73e3",
    isActive: true,
  });

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    try {
      const [sizesRes, typesRes, extrasRes, flavorsRes] = await Promise.all([
        fetch("/api/configuration/sizes"),
        fetch("/api/configuration/product-types"),
        fetch("/api/configuration/extras"),
        fetch("/api/configuration/flavors"),
      ]);

      if (sizesRes.ok) setSizes(await sizesRes.json());
      if (typesRes.ok) setTypes(await typesRes.json());
      if (extrasRes.ok) setExtras(await extrasRes.json());
      if (flavorsRes.ok) setFlavors(await flavorsRes.json());
    } catch (error) {
      console.error("Error fetching configuration:", error);
    }
  }

  async function handleSaveSize() {
    if (editingId) {
      await fetch("/api/configuration/sizes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...sizeForm }),
      });
      setEditingId(null);
    } else {
      await fetch("/api/configuration/sizes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sizeForm),
      });
    }
    setSizeForm({ code: "", label: "", ounces: 0, price: 0, baseCost: 0 });
    fetchAll();
  }

  async function handleDeleteSize(id: string) {
    if (confirm("¿Estás seguro?")) {
      await fetch(`/api/configuration/sizes?id=${id}`, { method: "DELETE" });
      fetchAll();
    }
  }

  async function handleSaveType() {
    if (editingId) {
      await fetch("/api/configuration/product-types", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...typeForm }),
      });
      setEditingId(null);
    } else {
      await fetch("/api/configuration/product-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(typeForm),
      });
    }
    setTypeForm({ code: "", label: "", priceModifier: 0, costModifier: 0 });
    fetchAll();
  }

  async function handleDeleteType(id: string) {
    if (confirm("¿Estás seguro?")) {
      await fetch(`/api/configuration/product-types?id=${id}`, {
        method: "DELETE",
      });
      fetchAll();
    }
  }

  async function handleSaveExtra() {
    if (editingId) {
      await fetch("/api/configuration/extras", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...extraForm }),
      });
      setEditingId(null);
    } else {
      await fetch("/api/configuration/extras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(extraForm),
      });
    }
    setExtraForm({ name: "", price: 0, cost: 0 });
    fetchAll();
  }

  async function handleDeleteExtra(id: string) {
    if (confirm("¿Estás seguro?")) {
      await fetch(`/api/configuration/extras?id=${id}`, { method: "DELETE" });
      fetchAll();
    }
  }

  async function handleSaveFlavor() {
    if (editingId) {
      await fetch("/api/configuration/flavors", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...flavorForm }),
      });
      setEditingId(null);
    } else {
      await fetch("/api/configuration/flavors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flavorForm),
      });
    }
    setFlavorForm({ name: "", color: "#ff73e3", isActive: true });
    fetchAll();
  }

  async function handleDeleteFlavor(id: string) {
    if (confirm("¿Estás seguro?")) {
      await fetch(`/api/configuration/flavors?id=${id}`, { method: "DELETE" });
      fetchAll();
    }
  }

  const handleEditSize = (size: ProductSize) => {
    setEditingId(size.id!);
    setSizeForm({
      code: size.code,
      label: size.label,
      ounces: size.ounces,
      price: size.price,
      baseCost: size.baseCost,
    });
  };

  const handleEditType = (type: ProductType) => {
    setEditingId(type.id!);
    setTypeForm({
      code: type.code,
      label: type.label,
      priceModifier: type.priceModifier,
      costModifier: type.costModifier,
    });
  };

  const handleEditExtra = (extra: Extra) => {
    setEditingId(extra.id!);
    setExtraForm({ name: extra.name, price: extra.price, cost: extra.cost });
  };

  const handleEditFlavor = (flavor: Flavor) => {
    setEditingId(flavor.id!);
    setFlavorForm({
      name: flavor.name,
      color: flavor.color,
      isActive: flavor.isActive,
    });
  };

  return (
    <div className="mx-auto w-full max-w-6xl p-0">
      <h1 className="sr-only">Configuración de Productos</h1>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TabType)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sizes">📏 Tamaños</TabsTrigger>
          <TabsTrigger value="types">🔄 Tipos</TabsTrigger>
          <TabsTrigger value="extras">➕ Extras</TabsTrigger>
          <TabsTrigger value="flavors">🎨 Sabores</TabsTrigger>
        </TabsList>

        {/* Sizes Tab */}
        <TabsContent value="sizes" className="space-y-4">
          <div className="bg-card rounded-lg border p-6 shadow-sm dark:bg-slate-900">
            <h2 className="mb-4 font-semibold">Tamaños de Productos</h2>
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="size-code">Código</Label>
                <Input
                  id="size-code"
                  value={sizeForm.code}
                  onChange={(e) =>
                    setSizeForm({ ...sizeForm, code: e.target.value })
                  }
                  placeholder="8oz"
                  disabled={!!editingId}
                />
              </div>
              <div>
                <Label htmlFor="size-label">Etiqueta</Label>
                <Input
                  id="size-label"
                  value={sizeForm.label}
                  onChange={(e) =>
                    setSizeForm({ ...sizeForm, label: e.target.value })
                  }
                  placeholder="8 oz"
                />
              </div>
              <div>
                <Label htmlFor="size-ounces">Onzas</Label>
                <Input
                  id="size-ounces"
                  type="number"
                  value={sizeForm.ounces}
                  onChange={(e) =>
                    setSizeForm({
                      ...sizeForm,
                      ounces: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="size-price">Precio</Label>
                <Input
                  id="size-price"
                  type="number"
                  value={sizeForm.price}
                  onChange={(e) =>
                    setSizeForm({
                      ...sizeForm,
                      price: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="size-cost">Costo</Label>
                <Input
                  id="size-cost"
                  type="number"
                  value={sizeForm.baseCost}
                  onChange={(e) =>
                    setSizeForm({
                      ...sizeForm,
                      baseCost: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
            <Button onClick={handleSaveSize}>
              {editingId ? "Actualizar" : "Agregar"} Tamaño
            </Button>
            {editingId && (
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setSizeForm({
                    code: "",
                    label: "",
                    ounces: 0,
                    price: 0,
                    baseCost: 0,
                  });
                }}
                className="ml-2"
              >
                Cancelar
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {sizes.map((size) => (
              <div
                key={size.id}
                className="flex items-center justify-between rounded border p-3"
              >
                <div>
                  <p className="font-medium">
                    {size.label} ({size.code})
                  </p>
                  <p className="text-sm text-gray-600">
                    ${size.price.toLocaleString()} - Costo: $
                    {size.baseCost.toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditSize(size)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteSize(size.id!)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Types Tab */}
        <TabsContent value="types" className="space-y-4">
          <div className="rounded-lg border p-4">
            <h2 className="mb-4 font-semibold">Tipos de Productos</h2>
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="type-code">Código</Label>
                <Input
                  id="type-code"
                  value={typeForm.code}
                  onChange={(e) =>
                    setTypeForm({ ...typeForm, code: e.target.value })
                  }
                  placeholder="cremoso"
                  disabled={!!editingId}
                />
              </div>
              <div>
                <Label htmlFor="type-label">Etiqueta</Label>
                <Input
                  id="type-label"
                  value={typeForm.label}
                  onChange={(e) =>
                    setTypeForm({ ...typeForm, label: e.target.value })
                  }
                  placeholder="Cremoso"
                />
              </div>
              <div>
                <Label htmlFor="type-price">Modificador de Precio</Label>
                <Input
                  id="type-price"
                  type="number"
                  value={typeForm.priceModifier}
                  onChange={(e) =>
                    setTypeForm({
                      ...typeForm,
                      priceModifier: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="type-cost">Modificador de Costo</Label>
                <Input
                  id="type-cost"
                  type="number"
                  value={typeForm.costModifier}
                  onChange={(e) =>
                    setTypeForm({
                      ...typeForm,
                      costModifier: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
            <Button onClick={handleSaveType}>
              {editingId ? "Actualizar" : "Agregar"} Tipo
            </Button>
            {editingId && (
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setTypeForm({
                    code: "",
                    label: "",
                    priceModifier: 0,
                    costModifier: 0,
                  });
                }}
                className="ml-2"
              >
                Cancelar
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {types.map((type) => (
              <div
                key={type.id}
                className="flex items-center justify-between rounded border p-3"
              >
                <div>
                  <p className="font-medium">
                    {type.label} ({type.code})
                  </p>
                  <p className="text-sm text-gray-600">
                    Precio: +${type.priceModifier.toLocaleString()} | Costo: +$
                    {type.costModifier.toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditType(type)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteType(type.id!)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Extras Tab */}
        <TabsContent value="extras" className="space-y-4">
          <div className="rounded-lg border p-4">
            <h2 className="mb-4 font-semibold">Extras</h2>
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="extra-name">Nombre</Label>
                <Input
                  id="extra-name"
                  value={extraForm.name}
                  onChange={(e) =>
                    setExtraForm({ ...extraForm, name: e.target.value })
                  }
                  placeholder="Chamoy"
                />
              </div>
              <div>
                <Label htmlFor="extra-price">Precio</Label>
                <Input
                  id="extra-price"
                  type="number"
                  value={extraForm.price}
                  onChange={(e) =>
                    setExtraForm({
                      ...extraForm,
                      price: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="extra-cost">Costo</Label>
                <Input
                  id="extra-cost"
                  type="number"
                  value={extraForm.cost}
                  onChange={(e) =>
                    setExtraForm({
                      ...extraForm,
                      cost: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
            <Button onClick={handleSaveExtra}>
              {editingId ? "Actualizar" : "Agregar"} Extra
            </Button>
            {editingId && (
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setExtraForm({ name: "", price: 0, cost: 0 });
                }}
                className="ml-2"
              >
                Cancelar
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {extras.map((extra) => (
              <div
                key={extra.id}
                className="flex items-center justify-between rounded border p-3"
              >
                <div>
                  <p className="font-medium">{extra.name}</p>
                  <p className="text-sm text-gray-600">
                    ${extra.price.toLocaleString()} - Costo: $
                    {extra.cost.toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditExtra(extra)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteExtra(extra.id!)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Flavors Tab */}
        <TabsContent value="flavors" className="space-y-4">
          <div className="rounded-lg border p-4">
            <h2 className="mb-4 font-semibold">Sabores</h2>
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="flavor-name">Nombre</Label>
                <Input
                  id="flavor-name"
                  value={flavorForm.name}
                  onChange={(e) =>
                    setFlavorForm({ ...flavorForm, name: e.target.value })
                  }
                  placeholder="Chicle"
                />
              </div>
              <div>
                <Label htmlFor="flavor-color">Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="flavor-color"
                    type="color"
                    value={flavorForm.color}
                    onChange={(e) =>
                      setFlavorForm({ ...flavorForm, color: e.target.value })
                    }
                    className="h-10 w-12"
                  />
                  <Input
                    type="text"
                    value={flavorForm.color}
                    readOnly
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="flavor-active"
                  checked={flavorForm.isActive}
                  onChange={(e) =>
                    setFlavorForm({ ...flavorForm, isActive: e.target.checked })
                  }
                />
                <Label htmlFor="flavor-active">Activo</Label>
              </div>
            </div>
            <Button onClick={handleSaveFlavor}>
              {editingId ? "Actualizar" : "Agregar"} Sabor
            </Button>
            {editingId && (
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setFlavorForm({ name: "", color: "#ff73e3", isActive: true });
                }}
                className="ml-2"
              >
                Cancelar
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {flavors.map((flavor) => (
              <div
                key={flavor.id}
                className="flex items-center justify-between rounded border p-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-6 w-6 rounded"
                    style={{ backgroundColor: flavor.color }}
                  />
                  <div>
                    <p className="font-medium">{flavor.name}</p>
                    <p className="text-sm text-gray-600">
                      {flavor.isActive ? "Activo" : "Inactivo"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditFlavor(flavor)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteFlavor(flavor.id!)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
