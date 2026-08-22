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
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(date);
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
  "gomitas-enchilada": {
    "3k": 3000,
    "6k": 6000,
    "10k": 10000,
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
  if (!draft.sizeId || !draft.typeId) {
    return null;
  }

  let productType = productTypes.find(
    (item) => item.id === draft.typeId || item.code === draft.typeId,
  );
  if (!productType && draft.typeId === "44444444-5555-5555-5555-555555555555") {
    productType = {
      id: "44444444-5555-5555-5555-555555555555",
      code: "gomitas-enchilada",
      label: "Gomitas Enchiladas",
      priceModifier: 0,
      costModifier: 0,
    };
  }

  let size = sizes.find(
    (item) => item.id === draft.sizeId || item.code === draft.sizeId,
  );
  if (!size) {
    if (draft.sizeId === "33333333-3000-3000-3000-333333333333") {
      size = {
        id: "33333333-3000-3000-3000-333333333333",
        code: "3k",
        label: "Vasito 3K",
        ounces: 3,
        price: 3000,
        baseCost: 1000,
      };
    } else if (draft.sizeId === "33333333-6000-6000-6000-333333333333") {
      size = {
        id: "33333333-6000-6000-6000-333333333333",
        code: "6k",
        label: "Mediano 6K",
        ounces: 6,
        price: 6000,
        baseCost: 2000,
      };
    } else if (draft.sizeId === "33333333-9000-9000-9000-333333333333") {
      size = {
        id: "33333333-9000-9000-9000-333333333333",
        code: "10k",
        label: "Grande 10K",
        ounces: 10,
        price: 10000,
        baseCost: 3500,
      };
    }
  }

  if (!size || !productType) {
    return null;
  }

  const isGomita = productType.code === "gomitas-enchilada";
  const flavorId =
    draft.flavorId ||
    (isGomita ? "88888888-8888-8888-8888-888888888888" : undefined);

  if (!flavorId) {
    return null;
  }

  const matrixPrice = PRICE_MATRIX[productType.code]?.[size.code];
  if (matrixPrice === undefined || matrixPrice === null) {
    return null; // Invalid combination
  }

  const selectedExtras = extras.filter((item) =>
    draft.extraIds.includes(item.id),
  );

  const baseUnitPrice = matrixPrice;
  const unitPrice =
    baseUnitPrice + selectedExtras.reduce((sum, item) => sum + item.price, 0);
  const unitCost =
    size.baseCost +
    productType.costModifier +
    selectedExtras.reduce((sum, item) => sum + item.cost, 0);

  return {
    id: crypto.randomUUID(),
    sizeId: size.id,
    typeId: productType.id,
    flavorId,
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
