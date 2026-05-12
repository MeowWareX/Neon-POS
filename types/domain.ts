import type {
  PAYMENT_METHODS,
  PRODUCT_SIZES,
  PRODUCT_TYPES,
  USER_ROLES,
} from "@/lib/constants";

export type UserRole = (typeof USER_ROLES)[number];
export type ProductSizeCode = (typeof PRODUCT_SIZES)[number];
export type ProductTypeCode = (typeof PRODUCT_TYPES)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export type SyncState = "local" | "pending" | "synced";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface ProductSize {
  id: string;
  code: ProductSizeCode;
  label: string;
  ounces: number;
  price: number;
  baseCost: number;
}

export interface ProductType {
  id: string;
  code: ProductTypeCode;
  label: string;
  priceModifier: number;
  costModifier: number;
}

export interface Flavor {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
}

export interface ActiveFlavor {
  id: string;
  flavorId: string;
  tankNumber: 1 | 2 | 3;
  businessDate: string;
}

export interface Extra {
  id: string;
  name: string;
  price: number;
  cost: number;
  inventoryItemId?: string | null;
}

export interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  reorderPoint: number;
  unitCost: number;
  category: string;
}

export interface InventoryMovement {
  id: string;
  inventoryItemId: string;
  type: "sale" | "purchase" | "adjustment" | "waste";
  quantity: number;
  note: string;
  createdAt: string;
}

export interface Purchase {
  id: string;
  inventoryItemId: string;
  quantity: number;
  vendor: string;
  total: number;
  note?: string;
  createdAt: string;
}

export interface OrderItemDraft {
  sizeId?: string;
  typeId?: string;
  flavorId?: string;
  extraIds: string[];
  quantity: number;
}

export interface OrderItem {
  id: string;
  sizeId: string;
  typeId: string;
  flavorId: string;
  extraIds: string[];
  quantity: number;
  unitPrice: number;
  unitCost: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  subtotal: number;
  total: number;
  estimatedCost: number;
  syncState: SyncState;
  createdAt: string;
}

export interface CashSession {
  id: string;
  openedAt: string;
  openingCash: number;
  closedAt?: string | null;
  closingCash?: number | null;
  expectedCash?: number | null;
  difference?: number | null;
  status: "open" | "closed";
}

export interface Expense {
  id: string;
  concept: string;
  amount: number;
  category: string;
  createdAt: string;
}

export interface LoanPayment {
  id: string;
  lender: string;
  amount: number;
  balanceAfterPayment: number;
  createdAt: string;
}
