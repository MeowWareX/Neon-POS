import type {
  ActiveFlavor,
  Extra,
  Flavor,
  InventoryItem,
  ProductSize,
  ProductType,
} from "@/types/domain";

function toNumber(value: unknown, fallback = 0) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function mapProductSizeRow(row: Record<string, unknown>): ProductSize {
  return {
    id: row.id,
    code: row.code,
    label: row.label,
    ounces: toNumber(row.ounces),
    price: toNumber(row.base_price ?? row.price),
    baseCost: toNumber(row.base_cost ?? row.baseCost),
    inventoryItemId: row.inventory_item_id ?? null,
    usageQuantity: toNumber(row.usage_quantity ?? row.usageQuantity, 1),
  };
}

export function mapProductTypeRow(row: Record<string, unknown>): ProductType {
  return {
    id: row.id,
    code: row.code,
    label: row.label,
    priceModifier: toNumber(row.price_modifier ?? row.priceModifier),
    costModifier: toNumber(row.cost_modifier ?? row.costModifier),
    inventoryItemId: row.inventory_item_id ?? null,
    usageQuantity: toNumber(row.usage_quantity ?? row.usageQuantity, 1),
  };
}

export function mapExtraRow(row: Record<string, unknown>): Extra {
  return {
    id: row.id,
    name: row.name,
    price: toNumber(row.price),
    cost: toNumber(row.cost),
    inventoryItemId: row.inventory_item_id ?? null,
    usageQuantity: toNumber(row.usage_quantity ?? row.usageQuantity, 1),
  };
}

export function mapFlavorRow(row: Record<string, unknown>): Flavor {
  return {
    id: row.id,
    name: row.name,
    color: row.color ?? "#ff73e3",
    isActive: Boolean(row.is_active ?? row.isActive),
  };
}

export function mapActiveFlavorRow(row: Record<string, unknown>): ActiveFlavor {
  return {
    id: row.id,
    flavorId: row.flavor_id,
    businessDate: row.business_date,
    tankNumber: toNumber(row.tank_number) as 1 | 2 | 3,
  };
}

export function mapInventoryItemRow(
  row: Record<string, unknown>,
): InventoryItem {
  return {
    id: row.id,
    name: row.name,
    unit: row.unit,
    currentStock: toNumber(row.current_stock),
    reorderPoint: toNumber(row.reorder_point),
    unitCost: toNumber(row.unit_cost),
    category: row.category,
  };
}
