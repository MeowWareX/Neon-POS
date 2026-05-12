import type {
  Flavor,
  InventoryConsumptionRule,
  OrderItem,
} from "@/types/domain";
import { EXTRA_TO_INVENTORY_ITEM_ID, SIZE_TO_INVENTORY_ITEM_ID } from "@/lib/catalog-ids";

export interface InventoryConsumptionDelta {
  inventoryItemId: string;
  quantity: number;
  note: string;
}

export interface InventoryConsumptionCatalog {
  flavors: Flavor[];
  rules: InventoryConsumptionRule[];
}

function matchesRule(
  rule: InventoryConsumptionRule,
  item: OrderItem,
): boolean {
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

export function calculateInventoryConsumptionDeltas(
  item: OrderItem,
  catalog: InventoryConsumptionCatalog,
): InventoryConsumptionDelta[] {
  const activeRules = catalog.rules.filter((rule) => rule.isActive);
  const matchingRules = activeRules.filter((rule) => matchesRule(rule, item));

  if (matchingRules.length > 0) {
    const selectedFlavor = catalog.flavors.find((flavor) => flavor.id === item.flavorId);

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
  const sizeInventoryItemId = SIZE_TO_INVENTORY_ITEM_ID[item.sizeId];

  if (sizeInventoryItemId) {
    deltas.push({
      inventoryItemId: sizeInventoryItemId,
      quantity: -item.quantity,
      note: "Vaso por tamaño",
    });
  }

  for (const extraId of item.extraIds) {
    const inventoryItemId = EXTRA_TO_INVENTORY_ITEM_ID[extraId];

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