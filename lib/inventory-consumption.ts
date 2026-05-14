import type {
  Extra,
  Flavor,
  InventoryItem,
  InventoryConsumptionRule,
  OrderItem,
  ProductSize,
} from "@/types/domain";

export interface InventoryConsumptionDelta {
  inventoryItemId: string;
  quantity: number;
  note: string;
}

export interface InventoryConsumptionCatalog {
  flavors: Flavor[];
  sizes: ProductSize[];
  extras: Extra[];
  rules: InventoryConsumptionRule[];
}

export interface InventoryShortage {
  inventoryItemId: string;
  itemName: string;
  required: number;
  available: number;
  missing: number;
}

export interface RecipeConfigurationIssue {
  ruleId: string;
  productTypeId?: string | null;
  productSizeId?: string | null;
  extraId?: string | null;
  reason: "missing-inventory-item" | "missing-flavor-inventory-item";
  note?: string | null;
}

function matchesRule(rule: InventoryConsumptionRule, item: OrderItem): boolean {
  if (rule.productTypeId && rule.productTypeId !== item.typeId) {
    return false;
  }

  if (rule.productSizeId && rule.productSizeId !== item.sizeId) {
    return false;
  }

  if (rule.extraId && !item.extraIds.includes(rule.extraId)) {
    return false;
  }

  return true;
}

function getSizeInventoryItemId(
  catalog: InventoryConsumptionCatalog,
  sizeId: string,
) {
  return (
    catalog.sizes.find((size) => size.id === sizeId)?.inventoryItemId ?? null
  );
}

function getExtraInventoryItemId(
  catalog: InventoryConsumptionCatalog,
  extraId: string,
) {
  return (
    catalog.extras.find((extra) => extra.id === extraId)?.inventoryItemId ??
    null
  );
}

export function calculateInventoryConsumptionDeltas(
  item: OrderItem,
  catalog: InventoryConsumptionCatalog,
): InventoryConsumptionDelta[] {
  const activeRules = catalog.rules.filter((rule) => rule.isActive);
  const matchingRules = activeRules.filter((rule) => matchesRule(rule, item));

  if (matchingRules.length > 0) {
    const selectedFlavor = catalog.flavors.find(
      (flavor) => flavor.id === item.flavorId,
    );

    return matchingRules.flatMap((rule) => {
      const inventoryItemId = rule.consumesSelectedFlavor
        ? selectedFlavor?.inventoryItemId
        : rule.inventoryItemId;

      if (!inventoryItemId) {
        return [];
      }

      return [
        {
          inventoryItemId,
          quantity: -(rule.quantity * item.quantity),
          note: rule.note ?? "Consumo por receta",
        },
      ];
    });
  }

  const deltas: InventoryConsumptionDelta[] = [];
  const sizeInventoryItemId = getSizeInventoryItemId(catalog, item.sizeId);

  if (sizeInventoryItemId) {
    deltas.push({
      inventoryItemId: sizeInventoryItemId,
      quantity: -item.quantity,
      note: "Vaso por tamaño",
    });
  }

  for (const extraId of item.extraIds) {
    const inventoryItemId = getExtraInventoryItemId(catalog, extraId);

    if (!inventoryItemId) {
      continue;
    }

    deltas.push({
      inventoryItemId,
      quantity: -item.quantity,
      note: "Extra por pedido",
    });
  }

  return deltas;
}

export function calculateOrderRecipeConfigurationIssues(
  items: OrderItem[],
  catalog: InventoryConsumptionCatalog,
) {
  const issues = new Map<string, RecipeConfigurationIssue>();

  items.forEach((item) => {
    const selectedFlavor = catalog.flavors.find(
      (flavor) => flavor.id === item.flavorId,
    );

    const matchingRules = catalog.rules
      .filter((rule) => rule.isActive)
      .filter((rule) => matchesRule(rule, item));

    matchingRules.forEach((rule) => {
      if (rule.consumesSelectedFlavor && !selectedFlavor?.inventoryItemId) {
        issues.set(`${rule.id}-${item.flavorId}`, {
          ruleId: rule.id,
          productTypeId: rule.productTypeId,
          productSizeId: rule.productSizeId,
          extraId: rule.extraId,
          reason: "missing-flavor-inventory-item",
          note: rule.note,
        });
      }

      if (!rule.consumesSelectedFlavor && !rule.inventoryItemId) {
        issues.set(rule.id, {
          ruleId: rule.id,
          productTypeId: rule.productTypeId,
          productSizeId: rule.productSizeId,
          extraId: rule.extraId,
          reason: "missing-inventory-item",
          note: rule.note,
        });
      }
    });
  });

  return Array.from(issues.values());
}

export function calculateOrderInventoryRequirements(
  items: OrderItem[],
  catalog: InventoryConsumptionCatalog,
) {
  const requiredByItem = new Map<string, number>();

  items.forEach((item) => {
    const deltas = calculateInventoryConsumptionDeltas(item, catalog);

    deltas.forEach((delta) => {
      const required = Math.abs(delta.quantity);
      requiredByItem.set(
        delta.inventoryItemId,
        (requiredByItem.get(delta.inventoryItemId) ?? 0) + required,
      );
    });
  });

  return requiredByItem;
}

export function calculateInventoryShortages({
  items,
  catalog,
  inventoryItems,
}: {
  items: OrderItem[];
  catalog: InventoryConsumptionCatalog;
  inventoryItems: InventoryItem[];
}): InventoryShortage[] {
  const requiredByItem = calculateOrderInventoryRequirements(items, catalog);

  return Array.from(requiredByItem.entries())
    .map(([inventoryItemId, required]) => {
      const current = inventoryItems.find(
        (item) => item.id === inventoryItemId,
      );
      const available = current?.currentStock ?? 0;
      return {
        inventoryItemId,
        itemName: current?.name ?? "Insumo sin nombre",
        required,
        available,
        missing: Math.max(0, required - available),
      };
    })
    .filter((entry) => entry.missing > 0);
}
