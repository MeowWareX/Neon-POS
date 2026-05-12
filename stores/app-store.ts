"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SIZE_TO_INVENTORY_ITEM_ID } from "@/lib/catalog-ids";
import { buildDemoState } from "@/lib/demo-data";
import { getBusinessDate } from "@/lib/business";
import { STORAGE_KEY } from "@/lib/constants";
import type {
  ActiveFlavor,
  CashSession,
  Expense,
  InventoryMovement,
  LoanPayment,
  Order,
  Purchase,
} from "@/types/domain";

type InventoryMovementInput = Omit<InventoryMovement, "id" | "createdAt">;
type PurchaseInput = Omit<Purchase, "id" | "createdAt">;
type ExpenseInput = Omit<Expense, "id" | "createdAt">;
type LoanPaymentInput = Omit<LoanPayment, "id" | "createdAt">;

interface AppState extends ReturnType<typeof buildDemoState> {
  initialized: boolean;
  businessDate: string;
  initialize: () => void;
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
}

const demo = buildDemoState();

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...demo,
      initialized: false,
      businessDate: getBusinessDate(),
      initialize: () => {
        if (get().initialized) {
          return;
        }

        set({ initialized: true });
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
            const cupInventoryId = SIZE_TO_INVENTORY_ITEM_ID[item.sizeId];
            if (cupInventoryId) {
              decrementInventory(
                cupInventoryId,
                item.quantity,
                `Pedido ${order.orderNumber}`,
              );
            }

            item.extraIds.forEach((extraId) => {
              const extra = state.extras.find((entry) => entry.id === extraId);
              if (extra?.inventoryItemId) {
                decrementInventory(
                  extra.inventoryItemId,
                  item.quantity,
                  `Pedido ${order.orderNumber}`,
                );
              }
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
          const filtered = state.activeFlavors.filter(
            (item) => item.flavorId !== flavorId,
          );

          const withoutTank = tankNumber
            ? filtered.filter((item) => item.tankNumber !== tankNumber)
            : filtered;

          nextActiveFlavors = tankNumber
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
    }),
    {
      name: STORAGE_KEY,
      version: 2,
      migrate: () => ({
        ...buildDemoState(),
        initialized: false,
        businessDate: getBusinessDate(),
      }),
      partialize: (state) => ({
        initialized: state.initialized,
        businessDate: state.businessDate,
        users: state.users,
        sizes: state.sizes,
        productTypes: state.productTypes,
        flavors: state.flavors,
        activeFlavors: state.activeFlavors,
        extras: state.extras,
        inventoryItems: state.inventoryItems,
        inventoryMovements: state.inventoryMovements,
        purchases: state.purchases,
        orders: state.orders,
        cashSessions: state.cashSessions,
        expenses: state.expenses,
        loanPayments: state.loanPayments,
      }),
    },
  ),
);
