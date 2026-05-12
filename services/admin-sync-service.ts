"use client";

import { activeFlavorSyncSchema } from "@/schemas/flavors";
import { closeCashSyncSchema, openCashSyncSchema } from "@/schemas/cash";
import { expenseSyncSchema, loanPaymentSyncSchema } from "@/schemas/accounting";
import {
  inventoryMovementSyncSchema,
  purchaseSyncSchema,
} from "@/schemas/inventory";
import type {
  ActiveFlavor,
  CashSession,
  Expense,
  InventoryMovement,
  LoanPayment,
  Purchase,
} from "@/types/domain";

async function postJson(url: string, payload: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("No se pudo sincronizar el cambio.");
  }

  return (await response.json()) as {
    synced: boolean;
    mode: "supabase" | "demo";
  };
}

export function syncInventoryMovement(movement: InventoryMovement) {
  return postJson(
    "/api/inventory/movements",
    inventoryMovementSyncSchema.parse(movement),
  );
}

export function syncPurchase(purchase: Purchase) {
  return postJson("/api/purchases", purchaseSyncSchema.parse(purchase));
}

export function syncCashOpening(session: CashSession) {
  return postJson(
    "/api/cash-sessions/open",
    openCashSyncSchema.parse({
      id: session.id,
      openingCash: session.openingCash,
      openedAt: session.openedAt,
      status: session.status,
    }),
  );
}

export function syncCashClosing(session: CashSession) {
  return postJson(
    "/api/cash-sessions/close",
    closeCashSyncSchema.parse({
      id: session.id,
      closingCash: session.closingCash ?? 0,
      expectedCash: session.expectedCash ?? 0,
      difference: session.difference ?? 0,
      closedAt: session.closedAt ?? new Date().toISOString(),
      status: session.status,
    }),
  );
}

export function syncExpense(expense: Expense) {
  return postJson("/api/expenses", expenseSyncSchema.parse(expense));
}

export function syncLoanPayment(payment: LoanPayment) {
  return postJson("/api/loan-payments", loanPaymentSyncSchema.parse(payment));
}

export function syncActiveFlavor(input: {
  flavorId: ActiveFlavor["flavorId"];
  tankNumber: 1 | 2 | 3 | null;
  businessDate: string;
}) {
  return postJson("/api/active-flavors", activeFlavorSyncSchema.parse(input));
}
