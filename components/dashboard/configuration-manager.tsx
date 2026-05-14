"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/stores/app-store";
import type {
  Extra,
  Flavor,
  ProductSize,
  ProductType,
  InventoryItem,
  InventoryConsumptionRule,
} from "@/types/domain";

type TabType = "sizes" | "types" | "extras" | "flavors" | "recipes" | "inventory";

const initialRuleForm = {
  productTypeId: "",
  productSizeId: "",
  extraId: "",
  consumesSelectedFlavor: false,
  inventoryItemId: "",
  quantity: 1,
  note: "",
  isActive: true,
};

export function ConfigurationManager() {
  const refreshCatalog = useAppStore((state) => state.refreshCatalog);
  const [activeTab, setActiveTab] = useState<TabType>("sizes");
  const [sizes, setSizes] = useState<ProductSize[]>([]);
  const [types, setTypes] = useState<ProductType[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [flavors, setFlavors] = useState<Flavor[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [rules, setRules] = useState<InventoryConsumptionRule[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);

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
  const [inventoryItemForm, setInventoryItemForm] = useState({
    name: "",
    unit: "",
    category: "",
    reorderPoint: 0,
    unitCost: 0,
  });
  const [ruleForm, setRuleForm] = useState(initialRuleForm);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    try {
      const [
        sizesRes,
        typesRes,
        extrasRes,
        flavorsRes,
        inventoryItemsRes,
        rulesRes,
      ] = await Promise.all([
        fetch("/api/configuration/sizes"),
        fetch("/api/configuration/product-types"),
        fetch("/api/configuration/extras"),
        fetch("/api/configuration/flavors"),
        fetch("/api/inventory/items"),
        fetch("/api/inventory/consumption-rules"),
      ]);

      if (sizesRes.ok) setSizes(await sizesRes.json());
      if (typesRes.ok) setTypes(await typesRes.json());
      if (extrasRes.ok) setExtras(await extrasRes.json());
      if (flavorsRes.ok) setFlavors(await flavorsRes.json());
      if (inventoryItemsRes.ok) setInventoryItems(await inventoryItemsRes.json());
      if (rulesRes.ok) setRules(await rulesRes.json());
    } catch (error) {
      console.error("Error fetching configuration:", error);
    }
  }

  async function refreshAll() {
    await fetchAll();
    await refreshCatalog();
  }

  function resetRuleForm() {
    setEditingRuleId(null);
    setRuleForm(initialRuleForm);
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
    await refreshAll();
  }

  async function handleDeleteSize(id: string) {
    if (confirm("¿Estás seguro?")) {
      await fetch(`/api/configuration/sizes?id=${id}`, { method: "DELETE" });
      await refreshAll();
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
    await refreshAll();
  }

  async function handleDeleteType(id: string) {
    if (confirm("¿Estás seguro?")) {
      await fetch(`/api/configuration/product-types?id=${id}`, {
        method: "DELETE",
      });
      await refreshAll();
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
    await refreshAll();
  }

  async function handleDeleteExtra(id: string) {
    if (confirm("¿Estás seguro?")) {
      await fetch(`/api/configuration/extras?id=${id}`, { method: "DELETE" });
      await refreshAll();
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
    await refreshAll();
  }

  async function handleDeleteFlavor(id: string) {
    if (confirm("¿Estás seguro?")) {
      await fetch(`/api/configuration/flavors?id=${id}`, { method: "DELETE" });
      await refreshAll();
    }
  }

  async function handleSaveInventoryItem() {
    if (editingId) {
      await fetch("/api/inventory/items", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...inventoryItemForm }),
      });
      setEditingId(null);
    } else {
      await fetch("/api/inventory/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inventoryItemForm),
      });
    }
    setInventoryItemForm({
      name: "",
      unit: "",
      category: "",
      reorderPoint: 0,
      unitCost: 0,
    });
    await refreshAll();
  }

  async function handleDeleteInventoryItem(id: string) {
    if (confirm("¿Estás seguro? Si este ítem está siendo usado en recetas, no podrá eliminarse.")) {
      const response = await fetch(`/api/inventory/items?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await refreshAll();
      } else {
        const error = await response.json();
        alert("Error: " + error.error);
      }
    }
  }

  async function handleSaveRule() {
    const payload = {
      productTypeId: ruleForm.productTypeId || null,
      productSizeId: ruleForm.productSizeId || null,
      extraId: ruleForm.extraId || null,
      consumesSelectedFlavor: ruleForm.consumesSelectedFlavor,
      inventoryItemId: ruleForm.inventoryItemId || null,
      quantity: ruleForm.quantity,
      note: ruleForm.note || null,
      isActive: ruleForm.isActive,
    };

    if (editingRuleId) {
      await fetch("/api/inventory/consumption-rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingRuleId, ...payload }),
      });
    } else {
      await fetch("/api/inventory/consumption-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    resetRuleForm();
    await refreshAll();
  }

  async function handleDeleteRule(id: string) {
    if (confirm("¿Eliminar esta receta de consumo?")) {
      await fetch(`/api/inventory/consumption-rules?id=${id}`, {
        method: "DELETE",
      });
      await refreshAll();
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

  const handleEditRule = (rule: InventoryConsumptionRule) => {
    setEditingRuleId(rule.id);
    setRuleForm({
      productTypeId: rule.productTypeId ?? "",
      productSizeId: rule.productSizeId ?? "",
      extraId: rule.extraId ?? "",
      consumesSelectedFlavor: rule.consumesSelectedFlavor,
      inventoryItemId: rule.inventoryItemId ?? "",
      quantity: rule.quantity,
      note: rule.note ?? "",
      isActive: rule.isActive,
    });
  };

  const handleEditInventoryItem = (item: InventoryItem) => {
    setEditingId(item.id!);
    setInventoryItemForm({
      name: item.name,
      unit: item.unit,
      category: item.category || "",
      reorderPoint: item.reorderPoint || 0,
      unitCost: item.unitCost || 0,
    });
  };

  const ruleDescription = (rule: InventoryConsumptionRule) => {
    const typeLabel = rule.productTypeId
      ? types.find((item) => item.id === rule.productTypeId)?.label
      : "Todos los tipos";
    const sizeLabel = rule.productSizeId
      ? sizes.find((item) => item.id === rule.productSizeId)?.label
      : "Todos los tamaños";
    const extraLabel = rule.extraId
      ? extras.find((item) => item.id === rule.extraId)?.name
      : "Sin extra";
    const inventoryLabel = rule.consumesSelectedFlavor
      ? "Usa sabor seleccionado"
      : inventoryItems.find((item) => item.id === rule.inventoryItemId)?.name ??
        "Sin ítem";

    return {
      typeLabel,
      sizeLabel,
      extraLabel,
      inventoryLabel,
    };
  };

  return (
    <div className="mx-auto w-full max-w-6xl p-0">
      <h1 className="sr-only">Configuración de Productos</h1>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TabType)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="sizes">📏 Tamaños</TabsTrigger>
          <TabsTrigger value="types">🔄 Tipos</TabsTrigger>
          <TabsTrigger value="extras">➕ Extras</TabsTrigger>
          <TabsTrigger value="flavors">🎨 Sabores</TabsTrigger>
          <TabsTrigger value="recipes">🧪 Recetas</TabsTrigger>
          <TabsTrigger value="inventory">📦 Inventario</TabsTrigger>
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

        <TabsContent value="recipes" className="space-y-4">
          <div className="rounded-lg border p-4">
            <h2 className="mb-4 font-semibold">Recetas de consumo</h2>
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="rule-type">Tipo (opcional)</Label>
                <select
                  id="rule-type"
                  className="w-full rounded border bg-transparent px-3 py-2"
                  value={ruleForm.productTypeId}
                  onChange={(e) =>
                    setRuleForm({ ...ruleForm, productTypeId: e.target.value })
                  }
                >
                  <option value="">Todos</option>
                  {types.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="rule-size">Tamaño (opcional)</Label>
                <select
                  id="rule-size"
                  className="w-full rounded border bg-transparent px-3 py-2"
                  value={ruleForm.productSizeId}
                  onChange={(e) =>
                    setRuleForm({ ...ruleForm, productSizeId: e.target.value })
                  }
                >
                  <option value="">Todos</option>
                  {sizes.map((size) => (
                    <option key={size.id} value={size.id}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="rule-extra">Extra (opcional)</Label>
                <select
                  id="rule-extra"
                  className="w-full rounded border bg-transparent px-3 py-2"
                  value={ruleForm.extraId}
                  onChange={(e) =>
                    setRuleForm({ ...ruleForm, extraId: e.target.value })
                  }
                >
                  <option value="">No depende de extra</option>
                  {extras.map((extra) => (
                    <option key={extra.id} value={extra.id}>
                      {extra.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="rule-qty">Cantidad por unidad vendida</Label>
                <Input
                  id="rule-qty"
                  type="number"
                  min={0.01}
                  step={0.01}
                  value={ruleForm.quantity}
                  onChange={(e) =>
                    setRuleForm({
                      ...ruleForm,
                      quantity: Number(e.target.value) || 1,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="rule-item">Ítem de inventario</Label>
                <select
                  id="rule-item"
                  className="w-full rounded border bg-transparent px-3 py-2"
                  value={ruleForm.inventoryItemId}
                  onChange={(e) =>
                    setRuleForm({ ...ruleForm, inventoryItemId: e.target.value })
                  }
                  disabled={ruleForm.consumesSelectedFlavor}
                >
                  <option value="">Selecciona un ítem</option>
                  {inventoryItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.unit})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="rule-note">Nota</Label>
                <Input
                  id="rule-note"
                  value={ruleForm.note}
                  onChange={(e) =>
                    setRuleForm({ ...ruleForm, note: e.target.value })
                  }
                  placeholder="Ej: Base 16 oz"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rule-flavor"
                  checked={ruleForm.consumesSelectedFlavor}
                  onChange={(e) =>
                    setRuleForm({
                      ...ruleForm,
                      consumesSelectedFlavor: e.target.checked,
                      inventoryItemId: e.target.checked
                        ? ""
                        : ruleForm.inventoryItemId,
                    })
                  }
                />
                <Label htmlFor="rule-flavor">Consumir sabor seleccionado</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rule-active"
                  checked={ruleForm.isActive}
                  onChange={(e) =>
                    setRuleForm({ ...ruleForm, isActive: e.target.checked })
                  }
                />
                <Label htmlFor="rule-active">Regla activa</Label>
              </div>
            </div>
            <Button onClick={handleSaveRule}>
              {editingRuleId ? "Actualizar" : "Agregar"} Receta
            </Button>
            {editingRuleId && (
              <Button
                variant="outline"
                onClick={resetRuleForm}
                className="ml-2"
              >
                Cancelar
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {rules.map((rule) => {
              const description = ruleDescription(rule);
              return (
                <div
                  key={rule.id}
                  className="flex items-center justify-between rounded border p-3"
                >
                  <div>
                    <p className="font-medium">
                      {description.typeLabel} · {description.sizeLabel}
                    </p>
                    <p className="text-sm text-gray-600">
                      Extra: {description.extraLabel} | Consumo: {rule.quantity} |{" "}
                      {description.inventoryLabel}
                    </p>
                    <p className="text-xs text-gray-500">
                      {rule.note || "Sin nota"} · {rule.isActive ? "Activa" : "Inactiva"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditRule(rule)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteRule(rule.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Inventory Items Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="rounded-lg border p-4">
            <h2 className="mb-4 font-semibold">Ítems de Inventario</h2>
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="item-name">Nombre</Label>
                <Input
                  id="item-name"
                  value={inventoryItemForm.name}
                  onChange={(e) =>
                    setInventoryItemForm({
                      ...inventoryItemForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="Vaso 16oz"
                  disabled={!!editingId}
                />
              </div>
              <div>
                <Label htmlFor="item-unit">Unidad</Label>
                <Input
                  id="item-unit"
                  value={inventoryItemForm.unit}
                  onChange={(e) =>
                    setInventoryItemForm({
                      ...inventoryItemForm,
                      unit: e.target.value,
                    })
                  }
                  placeholder="u, ml, kg"
                  disabled={!!editingId}
                />
              </div>
              <div>
                <Label htmlFor="item-category">Categoría</Label>
                <Input
                  id="item-category"
                  value={inventoryItemForm.category}
                  onChange={(e) =>
                    setInventoryItemForm({
                      ...inventoryItemForm,
                      category: e.target.value,
                    })
                  }
                  placeholder="Vasos, Líquidos, etc."
                />
              </div>
              <div>
                <Label htmlFor="item-reorder">Punto de Reorden</Label>
                <Input
                  id="item-reorder"
                  type="number"
                  value={inventoryItemForm.reorderPoint}
                  onChange={(e) =>
                    setInventoryItemForm({
                      ...inventoryItemForm,
                      reorderPoint: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="item-cost">Costo por Unidad</Label>
                <Input
                  id="item-cost"
                  type="number"
                  value={inventoryItemForm.unitCost}
                  onChange={(e) =>
                    setInventoryItemForm({
                      ...inventoryItemForm,
                      unitCost: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
            <Button onClick={handleSaveInventoryItem}>
              {editingId ? "Actualizar" : "Agregar"} Ítem
            </Button>
            {editingId && (
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setInventoryItemForm({
                    name: "",
                    unit: "",
                    category: "",
                    reorderPoint: 0,
                    unitCost: 0,
                  });
                }}
                className="ml-2"
              >
                Cancelar
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {inventoryItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded border p-3"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    Unidad: {item.unit} | Categoría: {item.category || "Sin categoría"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Reorden: {item.reorderPoint} | Costo: ${item.unitCost?.toLocaleString() || "0"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditInventoryItem(item)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteInventoryItem(item.id!)}
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
