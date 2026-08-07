import type {
  LiquidVariantCode,
  PAYMENT_METHODS,
  PRODUCT_SIZES,
  PRODUCT_TYPES,
  USER_ROLES,
} from "@/lib/constants";

export type UserRole = (typeof USER_ROLES)[number];
export type ProductSizeCode = (typeof PRODUCT_SIZES)[number];
export type ProductTypeCode = (typeof PRODUCT_TYPES)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
export type { LiquidVariantCode };

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
  inventoryItemId?: string | null;
  usageQuantity?: number;
}

export interface ProductType {
  id: string;
  code: ProductTypeCode;
  label: string;
  priceModifier: number;
  costModifier: number;
  inventoryItemId?: string | null;
  usageQuantity?: number;
}

export interface Flavor {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
  inventoryItemId?: string | null;
}

export interface InventoryConsumptionRule {
  id: string;
  productTypeId?: string | null;
  productSizeId?: string | null;
  extraId?: string | null;
  consumesSelectedFlavor: boolean;
  inventoryItemId?: string | null;
  quantity: number;
  note?: string | null;
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
  usageQuantity?: number;
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
  totalUnits?: number;
  isHistorical?: boolean;
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

export type TreasuryAccountType = "cash" | "vault" | "digital" | "bank";

export interface TreasuryAccount {
  id: string;
  name: string;
  type: TreasuryAccountType;
  balance: number;
  description?: string;
  updatedAt: string;
}

export interface TreasuryTransfer {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  note: string;
  createdAt: string;
}

export interface HistoricalDay {
  id: string;
  date: string;
  unitsSold: number;
  totalCash: number;
  totalDigital: number;
  totalSales: number;
  nextDayBase: number;
  estimatedCost?: number;
  createdAt: string;
}

export interface LiquidSale {
  id: string;
  saleDate: string;
  variant: LiquidVariantCode;
  flavorId?: string | null;
  flavorName?: string | null;
  quantity: number;
  unitPrice: number;
  total: number;
  paymentMethod: PaymentMethod;
  customerName?: string | null;
  notes?: string | null;
  syncState?: SyncState;
  createdAt: string;
}

export interface LiquidSaleInput {
  saleDate: string;
  variant: LiquidVariantCode;
  flavorId?: string | null;
  flavorName?: string | null;
  quantity: number;
  paymentMethod: PaymentMethod;
  customerName?: string | null;
  notes?: string | null;
}

export type LiquidMovementType =
  | "production"
  | "sale"
  | "point_use"
  | "adjustment"
  | "waste";

export interface LiquidInventoryItem {
  id: string;
  flavorId?: string | null;
  flavorName: string;
  variant?: LiquidVariantCode | null;
  currentStock: number;
  unit: string;
  minStock: number;
  createdAt: string;
  updatedAt: string;
}

export interface LiquidInventoryMovement {
  id: string;
  liquidInventoryId: string;
  flavorName: string;
  movementType: LiquidMovementType;
  quantity: number; // positive for addition (production), negative for deduction (sale, point_use, waste)
  notes?: string | null;
  referenceId?: string | null;
  createdAt: string;
}

export interface LiquidProductionInput {
  flavorId?: string | null;
  flavorName: string;
  variant?: LiquidVariantCode | null;
  quantity: number;
  notes?: string | null;
}

export interface LiquidAdjustmentInput {
  liquidInventoryId: string;
  movementType: "point_use" | "adjustment" | "waste";
  quantity: number; // number of bags to deduct/adjust (positive value representing deducted amount)
  notes?: string | null;
}

