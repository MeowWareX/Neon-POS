"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { buildDemoState } from "@/lib/demo-data";
import { getBusinessDate } from "@/lib/business";
import { calculateInventoryConsumptionDeltas } from "@/lib/inventory-consumption";
import { LIQUID_VARIANT_CONFIG, STORAGE_KEY } from "@/lib/constants";
import type {
  ActiveFlavor,
  CashSession,
  Expense,
  HistoricalDay,
  InventoryMovement,
  LiquidAdjustmentInput,
  LiquidInventoryItem,
  LiquidInventoryMovement,
  LiquidProductionInput,
  LiquidSale,
  LiquidSaleInput,
  LoanPayment,
  Order,
  Purchase,
  TreasuryTransfer,
} from "@/types/domain";

type InventoryMovementInput = Omit<InventoryMovement, "id" | "createdAt">;
type PurchaseInput = Omit<Purchase, "id" | "createdAt">;
type ExpenseInput = Omit<Expense, "id" | "createdAt">;
type LoanPaymentInput = Omit<LoanPayment, "id" | "createdAt">;

interface AppState extends ReturnType<typeof buildDemoState> {
  initialized: boolean;
  businessDate: string;
  initialize: () => Promise<void>;
  refreshCatalog: () => Promise<void>;
  addOrder: (order: Order) => void;
  markOrdersSynced: (orderIds: string[]) => void;
  setFlavorTank: (
    flavorId: string,
    tankNumber: 1 | 2 | 3 | null,
  ) => ActiveFlavor[];
  addInventoryMovement: (input: InventoryMovementInput) => InventoryMovement;
  recordPurchase: (input: PurchaseInput) => Purchase;
  openCashSession: (openingCash: number) => CashSession | null;
  closeCashSession: (closingCash: number) => CashSession | null;
  addExpense: (input: ExpenseInput) => Expense;
  addLoanPayment: (input: LoanPaymentInput) => LoanPayment;
  addTreasuryTransfer: (input: {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    note: string;
  }) => TreasuryTransfer;
  addHistoricalDay: (input: {
    date: string;
    unitsSold: number;
    totalCash: number;
    totalDigital: number;
    nextDayBase: number;
    estimatedCost?: number;
  }) => HistoricalDay;
  addLiquidSale: (input: LiquidSaleInput) => LiquidSale;
  deleteLiquidSale: (id: string) => Promise<void>;
  addLiquidProduction: (
    input: LiquidProductionInput,
  ) => LiquidInventoryMovement;
  recordLiquidAdjustment: (
    input: LiquidAdjustmentInput,
  ) => LiquidInventoryMovement;
}

// Empty initial state - will be populated from BD
const emptyState = {
  users: [],
  sizes: [],
  productTypes: [],
  flavors: [],
  activeFlavors: [],
  extras: [],
  inventoryItems: [],
  inventoryConsumptionRules: [],
  inventoryMovements: [],
  purchases: [],
  orders: [],
  cashSessions: [],
  expenses: [],
  loanPayments: [],
  treasuryAccounts: [],
  treasuryTransfers: [],
  historicalDays: [],
  liquidSales: [],
  liquidInventory: [],
  liquidInventoryMovements: [],
};

function applyRemoteCatalog(
  state: ReturnType<typeof buildDemoState>,
  catalog: Awaited<ReturnType<typeof loadRemoteCatalog>>,
) {
  const remoteSizes = catalog.sizes || [];
  const mergedSizes = [...remoteSizes];
  state.sizes.forEach((ds) => {
    if (!mergedSizes.some((s) => s.code === ds.code || s.id === ds.id)) {
      mergedSizes.push(ds);
    }
  });

  const remoteTypes = catalog.productTypes || [];
  const mergedTypes = [...remoteTypes];
  state.productTypes.forEach((dt) => {
    if (!mergedTypes.some((t) => t.code === dt.code || t.id === dt.id)) {
      mergedTypes.push(dt);
    }
  });

  const remoteFlavors = catalog.flavors || [];
  const mergedFlavors = [...remoteFlavors];
  state.flavors.forEach((df) => {
    if (
      !mergedFlavors.some(
        (f) => f.name.toLowerCase() === df.name.toLowerCase() || f.id === df.id,
      )
    ) {
      mergedFlavors.push(df);
    }
  });

  return {
    sizes: mergedSizes.length ? mergedSizes : state.sizes,
    productTypes: mergedTypes.length ? mergedTypes : state.productTypes,
    extras: catalog.extras?.length ? catalog.extras : state.extras,
    flavors: mergedFlavors.length ? mergedFlavors : state.flavors,
    activeFlavors: catalog.activeFlavors?.length
      ? catalog.activeFlavors
      : state.activeFlavors,
    inventoryItems: catalog.inventoryItems?.length
      ? catalog.inventoryItems
      : state.inventoryItems,
    inventoryConsumptionRules: catalog.inventoryConsumptionRules?.length
      ? catalog.inventoryConsumptionRules
      : state.inventoryConsumptionRules,
    cashSessions: catalog.cashSessions?.length
      ? catalog.cashSessions
      : state.cashSessions,
    orders: catalog.orders?.length ? catalog.orders : state.orders,
    liquidSales: catalog.liquidSales?.length
      ? catalog.liquidSales
      : state.liquidSales,
    liquidInventory: catalog.liquidInventory?.length
      ? catalog.liquidInventory
      : state.liquidInventory,
    liquidInventoryMovements: catalog.liquidInventoryMovements?.length
      ? catalog.liquidInventoryMovements
      : state.liquidInventoryMovements,
  };
}

async function loadRemoteCatalog() {
  const [
    sizesRes,
    typesRes,
    extrasRes,
    flavorsRes,
    activeFlavorsRes,
    inventoryItemsRes,
    inventoryRulesRes,
    cashSessionsRes,
    ordersRes,
    liquidSalesRes,
    liquidInventoryRes,
  ] = await Promise.all([
    fetch("/api/configuration/sizes"),
    fetch("/api/configuration/product-types"),
    fetch("/api/configuration/extras"),
    fetch("/api/configuration/flavors"),
    fetch("/api/active-flavors"),
    fetch("/api/inventory/items"),
    fetch("/api/inventory/consumption-rules"),
    fetch("/api/cash-sessions"),
    fetch("/api/orders/list"),
    fetch("/api/liquid-sales"),
    fetch("/api/liquid-inventory"),
  ]);

  const liquidData = liquidInventoryRes.ok
    ? await liquidInventoryRes.json()
    : { inventory: null, movements: null };

  return {
    sizes: sizesRes.ok ? await sizesRes.json() : null,
    productTypes: typesRes.ok ? await typesRes.json() : null,
    extras: extrasRes.ok ? await extrasRes.json() : null,
    flavors: flavorsRes.ok ? await flavorsRes.json() : null,
    activeFlavors: activeFlavorsRes.ok ? await activeFlavorsRes.json() : null,
    inventoryItems: inventoryItemsRes.ok
      ? await inventoryItemsRes.json()
      : null,
    inventoryConsumptionRules: inventoryRulesRes.ok
      ? await inventoryRulesRes.json()
      : null,
    cashSessions: cashSessionsRes.ok
      ? (await cashSessionsRes.json()).sessions
      : null,
    orders: ordersRes.ok ? await ordersRes.json() : null,
    liquidSales: liquidSalesRes.ok ? await liquidSalesRes.json() : null,
    liquidInventory: liquidData.inventory ?? null,
    liquidInventoryMovements: liquidData.movements ?? null,
  };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...emptyState,
      users: [],
      initialized: false,
      businessDate: getBusinessDate(),
      refreshCatalog: async () => {
        if (typeof window === "undefined" || !window.navigator.onLine) {
          return;
        }

        try {
          const catalog = await loadRemoteCatalog();
          set((state) =>
            applyRemoteCatalog(
              state as ReturnType<typeof buildDemoState>,
              catalog,
            ),
          );
        } catch (error: unknown) {
          console.error("Failed to refresh remote catalog", error);
        }
      },
      initialize: async () => {
        if (get().initialized) {
          return;
        }

        set({ initialized: true });

        try {
          if (typeof window === "undefined" || !window.navigator.onLine) {
            throw new Error(
              "Network not available - cannot initialize from database",
            );
          }

          const catalog = await loadRemoteCatalog();

          // Validate that we got critical data from BD
          if (!catalog.sizes || catalog.sizes.length === 0) {
            throw new Error("No catalog data loaded from database");
          }

          set((state) =>
            applyRemoteCatalog(
              state as ReturnType<typeof buildDemoState>,
              catalog,
            ),
          );
        } catch (error: unknown) {
          console.error("Failed to initialize from database", error);
          set({ initialized: false });
          throw error;
        }
      },
      addOrder: (order) =>
        set((state) => {
          const movements: InventoryMovement[] = [];
          const updatedInventory = state.inventoryItems.map((item) => ({
            ...item,
          }));

          const decrementInventory = (
            inventoryItemId: string,
            amount: number,
            note: string,
          ) => {
            const target = updatedInventory.find(
              (item) => item.id === inventoryItemId,
            );
            if (target) {
              target.currentStock = Math.max(0, target.currentStock - amount);
            }
            movements.push({
              id: crypto.randomUUID(),
              inventoryItemId,
              type: "sale",
              quantity: -amount,
              note,
              createdAt: order.createdAt,
            });
          };

          order.items.forEach((item) => {
            const deltas = calculateInventoryConsumptionDeltas(item, {
              sizes: state.sizes,
              extras: state.extras,
              flavors: state.flavors,
              rules: state.inventoryConsumptionRules,
            });

            deltas.forEach((delta) => {
              decrementInventory(
                delta.inventoryItemId,
                Math.abs(delta.quantity),
                delta.note || `Pedido ${order.orderNumber}`,
              );
            });
          });

          return {
            orders: [order, ...state.orders],
            inventoryItems: updatedInventory,
            inventoryMovements: [...movements, ...state.inventoryMovements],
          };
        }),
      markOrdersSynced: (orderIds) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            orderIds.includes(order.id)
              ? { ...order, syncState: "synced" }
              : order,
          ),
        })),
      setFlavorTank: (flavorId, tankNumber) => {
        let nextActiveFlavors: ActiveFlavor[] = [];

        set((state) => {
          const otherDates = state.activeFlavors.filter(
            (item) => item.businessDate !== state.businessDate,
          );

          const todayFlavors = state.activeFlavors.filter(
            (item) => item.businessDate === state.businessDate,
          );

          const filtered = todayFlavors.filter(
            (item) => item.flavorId !== flavorId,
          );

          const withoutTank = tankNumber
            ? filtered.filter((item) => item.tankNumber !== tankNumber)
            : filtered;

          const updatedToday = tankNumber
            ? [
                ...withoutTank,
                {
                  id: crypto.randomUUID(),
                  flavorId,
                  tankNumber,
                  businessDate: state.businessDate,
                },
              ]
            : withoutTank;

          nextActiveFlavors = [...otherDates, ...updatedToday];

          return { activeFlavors: nextActiveFlavors };
        });

        return nextActiveFlavors;
      },
      addInventoryMovement: (input) => {
        const movement: InventoryMovement = {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          ...input,
          quantity: (input.type === "waste" ? -1 : 1) * input.quantity,
        };

        set((state) => {
          const direction = input.type === "waste" ? -1 : 1;
          return {
            inventoryMovements: [movement, ...state.inventoryMovements],
            inventoryItems: state.inventoryItems.map((item) =>
              item.id === input.inventoryItemId
                ? {
                    ...item,
                    currentStock: Math.max(
                      0,
                      item.currentStock + direction * input.quantity,
                    ),
                  }
                : item,
            ),
          };
        });

        return movement;
      },
      recordPurchase: (input) => {
        const purchase: Purchase = {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          ...input,
        };

        set((state) => {
          const purchaseMovement: InventoryMovement = {
            id: crypto.randomUUID(),
            inventoryItemId: input.inventoryItemId,
            type: "purchase",
            quantity: input.quantity,
            note: input.note ?? `Compra a ${input.vendor}`,
            createdAt: purchase.createdAt,
          };
          return {
            purchases: [purchase, ...state.purchases],
            inventoryItems: state.inventoryItems.map((item) =>
              item.id === input.inventoryItemId
                ? { ...item, currentStock: item.currentStock + input.quantity }
                : item,
            ),
            inventoryMovements: [purchaseMovement, ...state.inventoryMovements],
          };
        });

        return purchase;
      },
      openCashSession: (openingCash) => {
        let createdSession: CashSession | null = null;

        set((state) => {
          const existingOpen = state.cashSessions.some(
            (session) => session.status === "open",
          );
          if (existingOpen) {
            return state;
          }

          createdSession = {
            id: crypto.randomUUID(),
            openedAt: new Date().toISOString(),
            openingCash,
            status: "open",
          };

          return {
            cashSessions: [createdSession, ...state.cashSessions],
          };
        });

        return createdSession;
      },
      closeCashSession: (closingCash) => {
        let closedSession: CashSession | null = null;

        set((state) => {
          const openSession = state.cashSessions.find(
            (session) => session.status === "open",
          );

          if (!openSession) {
            return state;
          }

          const cashSales = state.orders
            .filter(
              (order) =>
                order.paymentMethod === "cash" &&
                new Date(order.createdAt) >= new Date(openSession.openedAt),
            )
            .reduce((sum, order) => sum + order.total, 0);

          const expectedCash = openSession.openingCash + cashSales;
          const nextClosedSession: CashSession = {
            ...openSession,
            status: "closed",
            closedAt: new Date().toISOString(),
            closingCash,
            expectedCash,
            difference: closingCash - expectedCash,
          };
          closedSession = nextClosedSession;

          return {
            cashSessions: state.cashSessions.map((session) =>
              session.id === openSession.id ? nextClosedSession : session,
            ),
          };
        });

        return closedSession;
      },
      addExpense: (input) => {
        const expense: Expense = {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          ...input,
        };

        set((state) => ({
          expenses: [expense, ...state.expenses],
        }));

        return expense;
      },
      addLoanPayment: (input) => {
        const payment: LoanPayment = {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          ...input,
        };

        set((state) => ({
          loanPayments: [payment, ...state.loanPayments],
        }));

        return payment;
      },
      addTreasuryTransfer: (input) => {
        const transfer: TreasuryTransfer = {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          ...input,
        };

        set((state) => ({
          treasuryAccounts: state.treasuryAccounts.map((acc) => {
            if (acc.id === input.fromAccountId) {
              return {
                ...acc,
                balance: acc.balance - input.amount,
                updatedAt: new Date().toISOString(),
              };
            }
            if (acc.id === input.toAccountId) {
              return {
                ...acc,
                balance: acc.balance + input.amount,
                updatedAt: new Date().toISOString(),
              };
            }
            return acc;
          }),
          treasuryTransfers: [transfer, ...state.treasuryTransfers],
        }));

        return transfer;
      },
      addHistoricalDay: (input) => {
        const totalSales = input.totalCash + input.totalDigital;
        const estimatedCost =
          input.estimatedCost ?? Math.round(totalSales * 0.3);

        const historicalDay: HistoricalDay = {
          id: crypto.randomUUID(),
          date: input.date,
          unitsSold: input.unitsSold,
          totalCash: input.totalCash,
          totalDigital: input.totalDigital,
          totalSales,
          nextDayBase: input.nextDayBase,
          estimatedCost,
          createdAt: new Date().toISOString(),
        };

        const newOrders: Order[] = [];
        const isoDate = `${input.date}T12:00:00.000Z`;

        if (input.totalCash > 0) {
          const cashRatio = totalSales > 0 ? input.totalCash / totalSales : 1;
          newOrders.push({
            id: crypto.randomUUID(),
            orderNumber: `HIST-CASH-${input.date}`,
            paymentMethod: "cash",
            subtotal: input.totalCash,
            total: input.totalCash,
            estimatedCost: Math.round(estimatedCost * cashRatio),
            totalUnits: Math.round(input.unitsSold * cashRatio),
            items: [],
            syncState: "local",
            isHistorical: true,
            createdAt: isoDate,
          });
        }

        if (input.totalDigital > 0) {
          const digitalRatio =
            totalSales > 0 ? input.totalDigital / totalSales : 1;
          const cashUnits = Math.round(
            input.unitsSold *
              (totalSales > 0 ? input.totalCash / totalSales : 1),
          );
          newOrders.push({
            id: crypto.randomUUID(),
            orderNumber: `HIST-DIG-${input.date}`,
            paymentMethod: "nequi",
            subtotal: input.totalDigital,
            total: input.totalDigital,
            estimatedCost: Math.round(estimatedCost * digitalRatio),
            totalUnits: input.unitsSold - cashUnits,
            items: [],
            syncState: "local",
            isHistorical: true,
            createdAt: `${input.date}T13:00:00.000Z`,
          });
        }

        set((state) => {
          const updatedAccounts =
            state.treasuryAccounts?.map((acc) => {
              if (
                acc.id === "acc-caja-menor" ||
                acc.name.toLowerCase().includes("caja menor")
              ) {
                return {
                  ...acc,
                  balance: input.nextDayBase,
                  updatedAt: new Date().toISOString(),
                };
              }
              return acc;
            }) ?? [];

          return {
            historicalDays: [historicalDay, ...state.historicalDays],
            orders: [...newOrders, ...state.orders],
            treasuryAccounts: updatedAccounts,
          };
        });

        return historicalDay;
      },
      addLiquidSale: (input: LiquidSaleInput) => {
        const config = LIQUID_VARIANT_CONFIG[input.variant];
        const unitPrice = config?.price ?? 0;
        const total = unitPrice * input.quantity;

        const newSale: LiquidSale = {
          id: crypto.randomUUID(),
          saleDate: input.saleDate,
          variant: input.variant,
          flavorId: input.flavorId || null,
          flavorName: input.flavorName || null,
          quantity: input.quantity,
          unitPrice,
          total,
          paymentMethod: input.paymentMethod,
          customerName: input.customerName || null,
          notes: input.notes || null,
          syncState: "pending",
          createdAt: new Date().toISOString(),
        };

        let updatedItem: LiquidInventoryItem | null = null;
        let newMovement: LiquidInventoryMovement | null = null;

        set((state) => {
          const targetFlavorName = (input.flavorName || "")
            .trim()
            .toLowerCase();
          const inventory = state.liquidInventory || [];
          const itemIndex = inventory.findIndex(
            (item) =>
              (input.flavorId && item.flavorId === input.flavorId) ||
              (targetFlavorName &&
                item.flavorName.toLowerCase() === targetFlavorName),
          );

          const nextInventory = [...inventory];
          let nextMovements = [...(state.liquidInventoryMovements || [])];

          if (itemIndex >= 0) {
            const existing = inventory[itemIndex];
            const newStock = Math.max(
              0,
              existing.currentStock - input.quantity,
            );
            updatedItem = {
              ...existing,
              currentStock: newStock,
              updatedAt: new Date().toISOString(),
            };
            nextInventory[itemIndex] = updatedItem;

            newMovement = {
              id: crypto.randomUUID(),
              liquidInventoryId: existing.id,
              flavorName: existing.flavorName,
              movementType: "sale",
              quantity: -input.quantity,
              notes: `Venta de ${input.quantity} bolsa(s) (${config?.label ?? input.variant})`,
              referenceId: newSale.id,
              createdAt: new Date().toISOString(),
            };
            nextMovements = [newMovement, ...nextMovements];
          }

          return {
            liquidSales: [newSale, ...(state.liquidSales || [])],
            liquidInventory: nextInventory,
            liquidInventoryMovements: nextMovements,
          };
        });

        if (typeof window !== "undefined" && window.navigator.onLine) {
          fetch("/api/liquid-sales", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newSale),
          })
            .then((res) => {
              if (res.ok) {
                set((state) => ({
                  liquidSales: state.liquidSales.map((s) =>
                    s.id === newSale.id ? { ...s, syncState: "synced" } : s,
                  ),
                }));
              }
            })
            .catch((err) => console.error("Error syncing liquid sale:", err));

          if (updatedItem && newMovement) {
            fetch("/api/liquid-inventory", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                item: updatedItem,
                movement: newMovement,
              }),
            }).catch((err) =>
              console.error(
                "Error syncing liquid inventory sale deduction:",
                err,
              ),
            );
          }
        }

        return newSale;
      },
      deleteLiquidSale: async (id: string) => {
        set((state) => {
          const saleToDelete = state.liquidSales.find((s) => s.id === id);
          const nextInventory = [...(state.liquidInventory || [])];
          let nextMovements = [...(state.liquidInventoryMovements || [])];

          if (saleToDelete) {
            const targetFlavorName = (saleToDelete.flavorName || "")
              .trim()
              .toLowerCase();
            const itemIndex = nextInventory.findIndex(
              (item) =>
                (saleToDelete.flavorId &&
                  item.flavorId === saleToDelete.flavorId) ||
                (targetFlavorName &&
                  item.flavorName.toLowerCase() === targetFlavorName),
            );

            if (itemIndex >= 0) {
              const existing = nextInventory[itemIndex];
              const restoredItem: LiquidInventoryItem = {
                ...existing,
                currentStock: existing.currentStock + saleToDelete.quantity,
                updatedAt: new Date().toISOString(),
              };
              nextInventory[itemIndex] = restoredItem;

              const restoreMovement: LiquidInventoryMovement = {
                id: crypto.randomUUID(),
                liquidInventoryId: existing.id,
                flavorName: existing.flavorName,
                movementType: "adjustment",
                quantity: saleToDelete.quantity,
                notes: `Restitución por venta de líquido eliminada #${saleToDelete.id.slice(0, 8)}`,
                referenceId: saleToDelete.id,
                createdAt: new Date().toISOString(),
              };
              nextMovements = [restoreMovement, ...nextMovements];

              if (typeof window !== "undefined" && window.navigator.onLine) {
                fetch("/api/liquid-inventory", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    item: restoredItem,
                    movement: restoreMovement,
                  }),
                }).catch((err) =>
                  console.error(
                    "Error syncing liquid inventory restoration:",
                    err,
                  ),
                );
              }
            }
          }

          return {
            liquidSales: state.liquidSales.filter((s) => s.id !== id),
            liquidInventory: nextInventory,
            liquidInventoryMovements: nextMovements,
          };
        });

        if (typeof window !== "undefined" && window.navigator.onLine) {
          try {
            await fetch(`/api/liquid-sales?id=${id}`, { method: "DELETE" });
          } catch (err) {
            console.error("Error deleting remote liquid sale:", err);
          }
        }
      },
      addLiquidProduction: (input: LiquidProductionInput) => {
        let createdMovement: LiquidInventoryMovement | null = null;
        let updatedItem: LiquidInventoryItem | null = null;

        set((state) => {
          const inventory = state.liquidInventory || [];
          const targetFlavorName = input.flavorName.trim().toLowerCase();
          const itemIndex = inventory.findIndex(
            (item) =>
              (input.flavorId && item.flavorId === input.flavorId) ||
              item.flavorName.toLowerCase() === targetFlavorName,
          );

          const nextInventory = [...inventory];

          if (itemIndex >= 0) {
            const existing = inventory[itemIndex];
            updatedItem = {
              ...existing,
              currentStock: existing.currentStock + input.quantity,
              variant: input.variant || existing.variant,
              updatedAt: new Date().toISOString(),
            };
            nextInventory[itemIndex] = updatedItem;
          } else {
            updatedItem = {
              id: crypto.randomUUID(),
              flavorId: input.flavorId || null,
              flavorName: input.flavorName.trim(),
              variant: input.variant || null,
              currentStock: input.quantity,
              unit: "bolsa",
              minStock: 2,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            nextInventory.push(updatedItem);
          }

          createdMovement = {
            id: crypto.randomUUID(),
            liquidInventoryId: updatedItem.id,
            flavorName: updatedItem.flavorName,
            movementType: "production",
            quantity: input.quantity,
            notes:
              input.notes || "Entrada de producción de líquido concentrado",
            createdAt: new Date().toISOString(),
          };

          return {
            liquidInventory: nextInventory,
            liquidInventoryMovements: [
              createdMovement,
              ...(state.liquidInventoryMovements || []),
            ],
          };
        });

        if (
          typeof window !== "undefined" &&
          window.navigator.onLine &&
          updatedItem &&
          createdMovement
        ) {
          fetch("/api/liquid-inventory", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              item: updatedItem,
              movement: createdMovement,
            }),
          }).catch((err) =>
            console.error("Error syncing liquid production:", err),
          );
        }

        return createdMovement!;
      },
      recordLiquidAdjustment: (input: LiquidAdjustmentInput) => {
        let createdMovement: LiquidInventoryMovement | null = null;
        let updatedItem: LiquidInventoryItem | null = null;

        set((state) => {
          const inventory = state.liquidInventory || [];
          const itemIndex = inventory.findIndex(
            (item) => item.id === input.liquidInventoryId,
          );

          if (itemIndex < 0) {
            return state;
          }

          const existing = inventory[itemIndex];
          const deductQty = Math.abs(input.quantity);
          const newStock = Math.max(0, existing.currentStock - deductQty);

          updatedItem = {
            ...existing,
            currentStock: newStock,
            updatedAt: new Date().toISOString(),
          };

          const nextInventory = [...inventory];
          nextInventory[itemIndex] = updatedItem;

          let movementNotes = input.notes;
          if (!movementNotes) {
            if (input.movementType === "point_use") {
              movementNotes = "Uso de bolsa de líquido en punto de venta";
            } else if (input.movementType === "waste") {
              movementNotes = "Descuento por merma o deterioro";
            } else {
              movementNotes = "Ajuste manual de inventario";
            }
          }

          createdMovement = {
            id: crypto.randomUUID(),
            liquidInventoryId: existing.id,
            flavorName: existing.flavorName,
            movementType: input.movementType,
            quantity: -deductQty,
            notes: movementNotes,
            createdAt: new Date().toISOString(),
          };

          return {
            liquidInventory: nextInventory,
            liquidInventoryMovements: [
              createdMovement,
              ...(state.liquidInventoryMovements || []),
            ],
          };
        });

        if (
          typeof window !== "undefined" &&
          window.navigator.onLine &&
          updatedItem &&
          createdMovement
        ) {
          fetch("/api/liquid-inventory", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              item: updatedItem,
              movement: createdMovement,
            }),
          }).catch((err) =>
            console.error("Error syncing liquid adjustment:", err),
          );
        }

        return createdMovement!;
      },
    }),
    {
      name: STORAGE_KEY,
      version: 10,
      migrate: (persistedState: unknown) => {
        const demo = buildDemoState();
        const prev = (persistedState as Partial<AppState>) || {};

        // Merge any new sizes from demo into prev.sizes if missing
        const prevSizes = prev.sizes || [];
        const mergedSizes = [...prevSizes];
        demo.sizes.forEach((ds) => {
          if (!mergedSizes.some((s) => s.code === ds.code || s.id === ds.id)) {
            mergedSizes.push(ds);
          }
        });

        // Merge any new productTypes from demo into prev.productTypes if missing (excluding premium)
        const prevTypes = (prev.productTypes || []).filter(
          (pt) => (pt.code as string) !== "premium",
        );
        const mergedProductTypes = [...prevTypes];
        demo.productTypes.forEach((dpt) => {
          if (
            (dpt.code as string) !== "premium" &&
            !mergedProductTypes.some(
              (pt) => pt.code === dpt.code || pt.id === dpt.id,
            )
          ) {
            mergedProductTypes.push(dpt);
          }
        });

        // Merge any new flavors from demo into prev.flavors if missing
        const prevFlavors = prev.flavors || [];
        const mergedFlavors = [...prevFlavors];
        demo.flavors.forEach((df) => {
          if (
            !mergedFlavors.some((f) => f.name === df.name || f.id === df.id)
          ) {
            mergedFlavors.push(df);
          }
        });

        const finalTypes = (
          mergedProductTypes.length ? mergedProductTypes : demo.productTypes
        ).filter((pt) => (pt.code as string) !== "premium");

        // Merge liquid inventory items
        const prevLiquidInventory = prev.liquidInventory || [];
        const mergedLiquidInventory = [...prevLiquidInventory];
        demo.liquidInventory.forEach((dli) => {
          if (
            !mergedLiquidInventory.some(
              (li) =>
                li.id === dli.id ||
                li.flavorName.toLowerCase() === dli.flavorName.toLowerCase(),
            )
          ) {
            mergedLiquidInventory.push(dli);
          }
        });

        // Merge liquid inventory movements
        const prevLiquidMovements = prev.liquidInventoryMovements || [];
        const mergedLiquidMovements = [...prevLiquidMovements];
        demo.liquidInventoryMovements.forEach((dlm) => {
          if (!mergedLiquidMovements.some((lm) => lm.id === dlm.id)) {
            mergedLiquidMovements.push(dlm);
          }
        });

        return {
          ...demo,
          ...prev,
          sizes: mergedSizes.length ? mergedSizes : demo.sizes,
          productTypes: finalTypes,
          flavors: mergedFlavors.length ? mergedFlavors : demo.flavors,
          treasuryAccounts: prev.treasuryAccounts?.length
            ? prev.treasuryAccounts
            : demo.treasuryAccounts,
          treasuryTransfers: prev.treasuryTransfers || demo.treasuryTransfers,
          historicalDays: prev.historicalDays || demo.historicalDays,
          liquidSales: prev.liquidSales || demo.liquidSales,
          liquidInventory: mergedLiquidInventory.length
            ? mergedLiquidInventory
            : demo.liquidInventory,
          liquidInventoryMovements: mergedLiquidMovements.length
            ? mergedLiquidMovements
            : demo.liquidInventoryMovements,
          users: prev.users || [],
          initialized: prev.initialized || false,
          businessDate: prev.businessDate || getBusinessDate(),
        };
      },
      partialize: (state) => ({
        initialized: state.initialized,
        businessDate: state.businessDate,
        users: state.users,
        // CATALOG - persisted across sessions
        sizes: state.sizes,
        productTypes: state.productTypes,
        flavors: state.flavors,
        activeFlavors: state.activeFlavors,
        extras: state.extras,
        inventoryConsumptionRules: state.inventoryConsumptionRules,
        // BUSINESS DAY DATA & TREASURY - persisted for consistency
        cashSessions: state.cashSessions,
        orders: state.orders,
        expenses: state.expenses,
        loanPayments: state.loanPayments,
        treasuryAccounts: state.treasuryAccounts,
        treasuryTransfers: state.treasuryTransfers,
        historicalDays: state.historicalDays,
        liquidSales: state.liquidSales,
        liquidInventory: state.liquidInventory,
        liquidInventoryMovements: state.liquidInventoryMovements,
        // LOCAL TRANSACTIONAL - cleared on reload (read from BD on next sync)
        inventoryItems: [],
        inventoryMovements: [],
        purchases: [],
      }),
    },
  ),
);
