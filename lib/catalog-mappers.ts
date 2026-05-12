import type {
  ActiveFlavor,
  Extra,
  Flavor,
  InventoryConsumptionRule,
  InventoryItem,
  ProductSize,
  ProductType,
} from "@/types/domain";

function toNumber(value: unknown, fallback = 0) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : value == null ? fallback : String(value);
}

function toNullableString(value: unknown) {
  return typeof value === "string" ? value : null;
}

export function mapProductSizeRow(row: Record<string, unknown>): ProductSize {
  return {
    id: toString(row.id),
    code: toString(row.code) as ProductSize["code"],
    label: toString(row.label),
    ounces: toNumber(row.ounces),
    price: toNumber(row.base_price ?? row.price),
    baseCost: toNumber(row.base_cost ?? row.baseCost),
    inventoryItemId: toNullableString(row.inventory_item_id),
    usageQuantity: toNumber(row.usage_quantity ?? row.usageQuantity, 1),
  };
}

export function mapProductTypeRow(row: Record<string, unknown>): ProductType {
  return {
    id: toString(row.id),
    code: toString(row.code) as ProductType["code"],
    label: toString(row.label),
    priceModifier: toNumber(row.price_modifier ?? row.priceModifier),
    costModifier: toNumber(row.cost_modifier ?? row.costModifier),
    inventoryItemId: toNullableString(row.inventory_item_id),
    usageQuantity: toNumber(row.usage_quantity ?? row.usageQuantity, 1),
  };
}

export function mapExtraRow(row: Record<string, unknown>): Extra {
  return {
    id: toString(row.id),
    name: toString(row.name),
    price: toNumber(row.price),
    cost: toNumber(row.cost),
    inventoryItemId: toNullableString(row.inventory_item_id),
    usageQuantity: toNumber(row.usage_quantity ?? row.usageQuantity, 1),
  };
}

export function mapFlavorRow(row: Record<string, unknown>): Flavor {
  return {
    id: toString(row.id),
    name: toString(row.name),
    color: toString(row.color, "#ff73e3"),
    isActive: Boolean(row.is_active ?? row.isActive),
    inventoryItemId: toNullableString(row.inventory_item_id),
  };
}

export function mapInventoryConsumptionRuleRow(
  row: Record<string, unknown>,
): InventoryConsumptionRule {
  return {
    id: toString(row.id),
    productTypeId: toNullableString(row.product_type_id),
    productSizeId: toNullableString(row.product_size_id),
    extraId: toNullableString(row.extra_id),
    consumesSelectedFlavor: Boolean(row.consumes_selected_flavor),
    inventoryItemId: toNullableString(row.inventory_item_id),
    quantity: toNumber(row.quantity, 1),
    note: toNullableString(row.note),
    isActive: Boolean(row.is_active ?? row.isActive),
  };
}

export function mapActiveFlavorRow(row: Record<string, unknown>): ActiveFlavor {
  return {
    id: toString(row.id),
    flavorId: toString(row.flavor_id),
    businessDate: toString(row.business_date),
    tankNumber: toNumber(row.tank_number) as 1 | 2 | 3,
  };
}

export function mapInventoryItemRow(
  row: Record<string, unknown>,
): InventoryItem {
  return {
    id: toString(row.id),
    name: toString(row.name),
    unit: toString(row.unit),
    currentStock: toNumber(row.current_stock),
    reorderPoint: toNumber(row.reorder_point),
    unitCost: toNumber(row.unit_cost),
    category: toString(row.category),
  };
}
