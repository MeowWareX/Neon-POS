import { subDays, subHours } from "date-fns";
import { getBusinessDate } from "@/lib/business";
import type {
  ActiveFlavor,
  AppUser,
  CashSession,
  Expense,
  Extra,
  Flavor,
  InventoryItem,
  InventoryMovement,
  LoanPayment,
  Order,
  ProductSize,
  ProductType,
  Purchase,
} from "@/types/domain";

export interface DemoState {
  users: AppUser[];
  sizes: ProductSize[];
  productTypes: ProductType[];
  flavors: Flavor[];
  activeFlavors: ActiveFlavor[];
  extras: Extra[];
  inventoryItems: InventoryItem[];
  inventoryMovements: InventoryMovement[];
  purchases: Purchase[];
  orders: Order[];
  cashSessions: CashSession[];
  expenses: Expense[];
  loanPayments: LoanPayment[];
}

export function buildDemoState(): DemoState {
  const businessDate = getBusinessDate();

  const users: AppUser[] = [
    {
      id: "11111111-1111-1111-1111-111111111111",
      name: "Admin Neon",
      email: "admin@neon.local",
      role: "admin",
    },
    {
      id: "22222222-2222-2222-2222-222222222222",
      name: "Operador Neon",
      email: "operator@neon.local",
      role: "operator",
    },
  ];

  const sizes: ProductSize[] = [
    {
      id: "33333333-1111-1111-1111-111111111111",
      code: "8oz",
      label: "8 oz",
      ounces: 8,
      price: 5000,
      baseCost: 1500,
    },
    {
      id: "33333333-2222-2222-2222-222222222222",
      code: "12oz",
      label: "12 oz",
      ounces: 12,
      price: 8000,
      baseCost: 2600,
    },
    {
      id: "33333333-3333-3333-3333-333333333333",
      code: "16oz",
      label: "16 oz",
      ounces: 16,
      price: 10000,
      baseCost: 3400,
    },
  ];

  const productTypes: ProductType[] = [
    {
      id: "44444444-1111-1111-1111-111111111111",
      code: "basico",
      label: "Básico",
      priceModifier: 0,
      costModifier: 0,
    },
    {
      id: "44444444-2222-2222-2222-222222222222",
      code: "premium",
      label: "Premium",
      priceModifier: 2500,
      costModifier: 700,
    },
    {
      id: "44444444-3333-3333-3333-333333333333",
      code: "cremoso",
      label: "Cremoso",
      priceModifier: 7000,
      costModifier: 2000,
    },
    {
      id: "44444444-4444-4444-4444-444444444444",
      code: "picoso",
      label: "Picoso",
      priceModifier: 5000,
      costModifier: 1000,
    },
  ];

  const flavors: Flavor[] = [
    {
      id: "55555555-1111-1111-1111-111111111111",
      name: "Chicle",
      color: "#ff73e3",
      isActive: true,
    },
    {
      id: "55555555-2222-2222-2222-222222222222",
      name: "Sandía",
      color: "#3de8c2",
      isActive: true,
    },
    {
      id: "55555555-3333-3333-3333-333333333333",
      name: "Maracumango",
      color: "#ffd24d",
      isActive: true,
    },
    {
      id: "55555555-4444-4444-4444-444444444444",
      name: "Limón",
      color: "#7df97f",
      isActive: false,
    },
  ];

  const activeFlavors: ActiveFlavor[] = [
    {
      id: "active-1",
      flavorId: "55555555-1111-1111-1111-111111111111",
      tankNumber: 1,
      businessDate,
    },
    {
      id: "active-2",
      flavorId: "55555555-2222-2222-2222-222222222222",
      tankNumber: 2,
      businessDate,
    },
    {
      id: "active-3",
      flavorId: "55555555-3333-3333-3333-333333333333",
      tankNumber: 3,
      businessDate,
    },
  ];

  const inventoryItems: InventoryItem[] = [
    {
      id: "66666666-1111-1111-1111-111111111111",
      name: "Vaso 8 oz",
      unit: "u",
      currentStock: 120,
      reorderPoint: 40,
      unitCost: 500,
      category: "envases",
    },
    {
      id: "66666666-2222-2222-2222-222222222222",
      name: "Vaso 12 oz",
      unit: "u",
      currentStock: 110,
      reorderPoint: 40,
      unitCost: 650,
      category: "envases",
    },
    {
      id: "66666666-3333-3333-3333-333333333333",
      name: "Vaso 16 oz",
      unit: "u",
      currentStock: 90,
      reorderPoint: 35,
      unitCost: 800,
      category: "envases",
    },
    {
      id: "66666666-4444-4444-4444-444444444444",
      name: "Chamoy",
      unit: "porción",
      currentStock: 55,
      reorderPoint: 15,
      unitCost: 500,
      category: "extras",
    },
    {
      id: "66666666-6666-6666-6666-666666666666",
      name: "Perlas explosivas",
      unit: "porción",
      currentStock: 28,
      reorderPoint: 10,
      unitCost: 600,
      category: "extras",
    },
    {
      id: "66666666-7777-7777-7777-777777777777",
      name: "Gomitas enchiladas",
      unit: "porción",
      currentStock: 42,
      reorderPoint: 14,
      unitCost: 650,
      category: "extras",
    },
    {
      id: "66666666-5555-5555-5555-555555555555",
      name: "Kit de dulces",
      unit: "kit",
      currentStock: 31,
      reorderPoint: 8,
      unitCost: 850,
      category: "extras",
    },
    {
      id: "66666666-8888-8888-8888-888888888888",
      name: "Jeringa con licor",
      unit: "u",
      currentStock: 16,
      reorderPoint: 6,
      unitCost: 1000,
      category: "extras",
    },
    {
      id: "66666666-9999-9999-9999-999999999999",
      name: "Lengua",
      unit: "u",
      currentStock: 50,
      reorderPoint: 10,
      unitCost: 300,
      category: "extras",
    },
    {
      id: "66666666-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      name: "Chupeta",
      unit: "u",
      currentStock: 100,
      reorderPoint: 20,
      unitCost: 200,
      category: "extras",
    },
    {
      id: "66666666-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      name: "Jeringa de sirope",
      unit: "u",
      currentStock: 40,
      reorderPoint: 10,
      unitCost: 150,
      category: "extras",
    },
  ];

  const extras: Extra[] = [
    {
      id: "77777777-1111-1111-1111-111111111111",
      name: "Chamoy",
      price: 2000,
      cost: 500,
      inventoryItemId: "66666666-4444-4444-4444-444444444444",
    },
    {
      id: "77777777-2222-2222-2222-222222222222",
      name: "Lengua",
      price: 1000,
      cost: 300,
      inventoryItemId: "66666666-9999-9999-9999-999999999999",
    },
    {
      id: "77777777-3333-3333-3333-333333333333",
      name: "Perlas explosivas",
      price: 2000,
      cost: 600,
      inventoryItemId: "66666666-6666-6666-6666-666666666666",
    },
    {
      id: "77777777-4444-4444-4444-444444444444",
      name: "Gomitas enchiladas",
      price: 2200,
      cost: 650,
      inventoryItemId: "66666666-7777-7777-7777-777777777777",
    },
    {
      id: "77777777-5555-5555-5555-555555555555",
      name: "Jeringa con licor",
      price: 2000,
      cost: 1000,
      inventoryItemId: "66666666-8888-8888-8888-888888888888",
    },
    {
      id: "77777777-6666-6666-6666-666666666666",
      name: "Jeringa de sirope",
      price: 1000,
      cost: 150,
      inventoryItemId: "66666666-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    },
    {
      id: "77777777-7777-7777-7777-777777777777",
      name: "Chupeta",
      price: 1000,
      cost: 200,
      inventoryItemId: "66666666-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    },
  ];

  const orders: Order[] = [
    {
      id: "88888888-1111-1111-1111-111111111111",
      orderNumber: "N-0001",
      paymentMethod: "cash",
      subtotal: 13500,
      total: 13500,
      estimatedCost: 4100,
      syncState: "synced",
      createdAt: subHours(new Date(), 4).toISOString(),
      items: [
        {
          id: "99999999-1111-1111-1111-111111111111",
          sizeId: "33333333-1111-1111-1111-111111111111",
          typeId: "44444444-1111-1111-1111-111111111111",
          flavorId: "55555555-1111-1111-1111-111111111111",
          extraIds: ["77777777-1111-1111-1111-111111111111"],
          quantity: 1,
          unitPrice: 9500,
          unitCost: 2900,
          lineTotal: 9500,
        },
        {
          id: "99999999-2222-2222-2222-222222222222",
          sizeId: "33333333-1111-1111-1111-111111111111",
          typeId: "44444444-4444-4444-4444-444444444444",
          flavorId: "55555555-3333-3333-3333-333333333333",
          extraIds: [],
          quantity: 1,
          unitPrice: 9500,
          unitCost: 3050,
          lineTotal: 9500,
        },
      ],
    },
    {
      id: "88888888-2222-2222-2222-222222222222",
      orderNumber: "N-0002",
      paymentMethod: "nequi",
      subtotal: 19000,
      total: 19000,
      estimatedCost: 5900,
      syncState: "synced",
      createdAt: subHours(new Date(), 2).toISOString(),
      items: [
        {
          id: "99999999-3333-3333-3333-333333333333",
          sizeId: "33333333-2222-2222-2222-222222222222",
          typeId: "44444444-2222-2222-2222-222222222222",
          flavorId: "55555555-2222-2222-2222-222222222222",
          extraIds: ["77777777-3333-3333-3333-333333333333"],
          quantity: 1,
          unitPrice: 16500,
          unitCost: 5000,
          lineTotal: 16500,
        },
      ],
    },
    {
      id: "88888888-3333-3333-3333-333333333333",
      orderNumber: "N-0003",
      paymentMethod: "transfer",
      subtotal: 20500,
      total: 20500,
      estimatedCost: 6650,
      syncState: "pending",
      createdAt: subHours(new Date(), 1).toISOString(),
      items: [
        {
          id: "99999999-4444-4444-4444-444444444444",
          sizeId: "33333333-3333-3333-3333-333333333333",
          typeId: "44444444-3333-3333-3333-333333333333",
          flavorId: "55555555-3333-3333-3333-333333333333",
          extraIds: ["77777777-4444-4444-4444-444444444444"],
          quantity: 1,
          unitPrice: 18200,
          unitCost: 5750,
          lineTotal: 18200,
        },
      ],
    },
  ];

  const inventoryMovements: InventoryMovement[] = [
    {
      id: "aaaaaaa1-1111-1111-1111-111111111111",
      inventoryItemId: "66666666-6666-6666-6666-666666666666",
      type: "sale",
      quantity: -1,
      note: "Pedido N-0002",
      createdAt: subHours(new Date(), 2).toISOString(),
    },
    {
      id: "aaaaaaa2-2222-2222-2222-222222222222",
      inventoryItemId: "66666666-8888-8888-8888-888888888888",
      type: "purchase",
      quantity: 8,
      note: "Reposición semanal",
      createdAt: subDays(new Date(), 1).toISOString(),
    },
  ];

  const purchases: Purchase[] = [
    {
      id: "bbbbbbb1-1111-1111-1111-111111111111",
      inventoryItemId: "66666666-8888-8888-8888-888888888888",
      quantity: 8,
      vendor: "Distribuidora Norte",
      total: 19200,
      note: "Entrega viernes",
      createdAt: subDays(new Date(), 1).toISOString(),
    },
  ];

  const cashSessions: CashSession[] = [
    {
      id: "ccccccc1-1111-1111-1111-111111111111",
      openedAt: subHours(new Date(), 6).toISOString(),
      openingCash: 80000,
      status: "open",
    },
  ];

  const expenses: Expense[] = [
    {
      id: "ddddddd1-1111-1111-1111-111111111111",
      concept: "Hielo extra",
      amount: 18000,
      category: "operación",
      createdAt: subHours(new Date(), 5).toISOString(),
    },
  ];

  const loanPayments: LoanPayment[] = [
    {
      id: "eeeeeee1-1111-1111-1111-111111111111",
      lender: "Socio fundador",
      amount: 50000,
      balanceAfterPayment: 450000,
      createdAt: subDays(new Date(), 2).toISOString(),
    },
  ];

  return {
    users,
    sizes,
    productTypes,
    flavors,
    activeFlavors,
    extras,
    inventoryItems,
    inventoryMovements,
    purchases,
    orders,
    cashSessions,
    expenses,
    loanPayments,
  };
}
