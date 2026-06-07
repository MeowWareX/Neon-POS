import { formatISO, startOfDay } from "date-fns";
import type {
  Extra,
  Order,
  OrderItem,
  OrderItemDraft,
  PaymentMethod,
  ProductSize,
  ProductType,
} from "@/types/domain";

export function getBusinessDate(date = new Date()) {
  return formatISO(startOfDay(date), { representation: "date" });
}

export function createOrderNumber(sequence: number) {
  return `N-${String(sequence + 1).padStart(4, "0")}`;
}

export const PRICE_MATRIX: Record<string, Record<string, number | null>> = {
  basico: {
    "8oz": 5000,
    "12oz": 8000,
    "16oz": 10000,
  },
  "con-licor": {
    "8oz": 7000,
    "12oz": 10000,
    "16oz": 15000,
  },
  cremoso: {
    "8oz": 8000,
    "12oz": 13000,
    "16oz": 17000,
  },
  picoso: {
    "8oz": null,
    "12oz": 13000,
    "16oz": 15000,
  },
};

export function calculateOrderItem({
  draft,
  sizes,
  productTypes,
  extras,
}: {
  draft: OrderItemDraft;
  sizes: ProductSize[];
  productTypes: ProductType[];
  extras: Extra[];
}): OrderItem | null {
  if (!draft.sizeId || !draft.typeId || !draft.flavorId) {
    return null;
  }

  const size = sizes.find((item) => item.id === draft.sizeId);
  const productType = productTypes.find((item) => item.id === draft.typeId);
  const selectedExtras = extras.filter((item) =>
    draft.extraIds.includes(item.id),
  );

  if (!size || !productType) {
    return null;
  }

  const matrixPrice = PRICE_MATRIX[productType.code]?.[size.code];
  if (matrixPrice === undefined || matrixPrice === null) {
    return null; // Invalid combination
  }

  const baseUnitPrice = matrixPrice;
  const unitPrice =
    baseUnitPrice + selectedExtras.reduce((sum, item) => sum + item.price, 0);
  const unitCost =
    size.baseCost +
    productType.costModifier +
    selectedExtras.reduce((sum, item) => sum + item.cost, 0);

  return {
    id: crypto.randomUUID(),
    sizeId: draft.sizeId,
    typeId: draft.typeId,
    flavorId: draft.flavorId,
    extraIds: draft.extraIds,
    quantity: draft.quantity,
    unitPrice,
    unitCost,
    lineTotal: unitPrice * draft.quantity,
  };
}

export function calculateOrderTotals(items: OrderItem[]) {
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const estimatedCost = items.reduce(
    (sum, item) => sum + item.unitCost * item.quantity,
    0,
  );

  return {
    subtotal,
    total: subtotal,
    estimatedCost,
  };
}

export function createOrderRecord({
  items,
  paymentMethod,
  sequence,
  syncState,
}: {
  items: OrderItem[];
  paymentMethod: PaymentMethod;
  sequence: number;
  syncState: Order["syncState"];
}): Order {
  const totals = calculateOrderTotals(items);

  return {
    id: crypto.randomUUID(),
    orderNumber: createOrderNumber(sequence),
    paymentMethod,
    items,
    subtotal: totals.subtotal,
    total: totals.total,
    estimatedCost: totals.estimatedCost,
    syncState,
    createdAt: new Date().toISOString(),
  };
}
