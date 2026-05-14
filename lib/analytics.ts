import {
  format,
  isSameDay,
  isSameMonth,
  isSameWeek,
  startOfMonth,
  subDays,
} from "date-fns";
import type {
  CashSession,
  Expense,
  Extra,
  Flavor,
  InventoryItem,
  LoanPayment,
  Order,
  ProductSize,
  ProductType,
} from "@/types/domain";

export function summarizeOrders(orders: Order[]) {
  const now = new Date();
  const todayOrders = orders.filter((order) => isSameDay(order.createdAt, now));
  const weeklyOrders = orders.filter((order) =>
    isSameWeek(order.createdAt, now, { weekStartsOn: 1 }),
  );
  const monthlyOrders = orders.filter((order) =>
    isSameMonth(order.createdAt, now),
  );

  const byPeriod = (input: Order[]) => ({
    count: input.length,
    sales: input.reduce((sum, order) => sum + order.total, 0),
  });

  return {
    today: byPeriod(todayOrders),
    weekly: byPeriod(weeklyOrders),
    monthly: byPeriod(monthlyOrders),
    averageTicket:
      orders.length > 0
        ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length
        : 0,
  };
}

export function getSalesTrend(orders: Order[]) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = subDays(new Date(), 6 - index);
    const dailyOrders = orders.filter((order) =>
      isSameDay(order.createdAt, date),
    );

    return {
      label: format(date, "EEE"),
      sales: dailyOrders.reduce((sum, order) => sum + order.total, 0),
      tickets: dailyOrders.length,
    };
  });
}

function topCounter(input: Record<string, number>) {
  return Object.entries(input)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([label, total]) => ({ label, total }));
}

export function getTopEntities({
  orders,
  sizes,
  productTypes,
  flavors,
  extras,
}: {
  orders: Order[];
  sizes: ProductSize[];
  productTypes: ProductType[];
  flavors: Flavor[];
  extras: Extra[];
}) {
  const sizeMap = new Map(sizes.map((size) => [size.id, size.label]));
  const typeMap = new Map(productTypes.map((item) => [item.id, item.label]));
  const flavorMap = new Map(flavors.map((flavor) => [flavor.id, flavor.name]));
  const extraMap = new Map(extras.map((extra) => [extra.id, extra.name]));

  const productCounts: Record<string, number> = {};
  const flavorCounts: Record<string, number> = {};
  const extraCounts: Record<string, number> = {};

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const productLabel = `${sizeMap.get(item.sizeId) ?? "?"} ${typeMap.get(item.typeId) ?? "?"}`;
      productCounts[productLabel] =
        (productCounts[productLabel] ?? 0) + item.quantity;

      const flavorLabel = flavorMap.get(item.flavorId) ?? "?";
      flavorCounts[flavorLabel] =
        (flavorCounts[flavorLabel] ?? 0) + item.quantity;

      item.extraIds.forEach((extraId) => {
        const extraLabel = extraMap.get(extraId) ?? "?";
        extraCounts[extraLabel] =
          (extraCounts[extraLabel] ?? 0) + item.quantity;
      });
    });
  });

  return {
    products: topCounter(productCounts),
    flavors: topCounter(flavorCounts),
    extras: topCounter(extraCounts),
  };
}

export function getCountsBreakdown({
  orders,
  sizes,
  productTypes,
  flavors,
}: {
  orders: Order[];
  sizes: ProductSize[];
  productTypes: ProductType[];
  flavors: Flavor[];
}) {
  const sizeMap = new Map(sizes.map((s) => [s.id, s.label]));
  const typeMap = new Map(productTypes.map((t) => [t.id, t.label]));
  const flavorMap = new Map(flavors.map((f) => [f.id, f.name]));

  const sizeCounts: Record<string, number> = {};
  const typeCounts: Record<string, number> = {};
  const flavorCounts: Record<string, number> = {};

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const sizeLabel = sizeMap.get(item.sizeId) ?? "Desconocido";
      sizeCounts[sizeLabel] = (sizeCounts[sizeLabel] ?? 0) + item.quantity;

      const typeLabel = typeMap.get(item.typeId) ?? "Desconocido";
      typeCounts[typeLabel] = (typeCounts[typeLabel] ?? 0) + item.quantity;

      const flavorLabel = flavorMap.get(item.flavorId) ?? "Desconocido";
      flavorCounts[flavorLabel] = (flavorCounts[flavorLabel] ?? 0) + item.quantity;
    });
  });

  return {
    sizes: sizeCounts,
    productTypes: typeCounts,
    flavors: flavorCounts,
  };
}

export function getPaymentsBreakdown(orders: Order[]) {
  const totals = orders.reduce<Record<string, number>>((acc, order) => {
    acc[order.paymentMethod] = (acc[order.paymentMethod] ?? 0) + order.total;
    return acc;
  }, {});

  return Object.entries(totals).map(([name, value]) => ({ name, value }));
}

export function getLowStockItems(inventoryItems: InventoryItem[]) {
  return inventoryItems.filter(
    (item) => item.currentStock <= item.reorderPoint,
  );
}

export function getProfitEstimate({
  orders,
  expenses,
  loanPayments,
}: {
  orders: Order[];
  expenses: Expense[];
  loanPayments: LoanPayment[];
}) {
  const monthStart = startOfMonth(new Date());

  const monthOrders = orders.filter(
    (order) => new Date(order.createdAt) >= monthStart,
  );
  const monthExpenses = expenses.filter(
    (expense) => new Date(expense.createdAt) >= monthStart,
  );
  const monthLoans = loanPayments.filter(
    (loan) => new Date(loan.createdAt) >= monthStart,
  );

  const revenue = monthOrders.reduce((sum, order) => sum + order.total, 0);
  const cogs = monthOrders.reduce((sum, order) => sum + order.estimatedCost, 0);
  const expensesTotal = monthExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );
  const loansTotal = monthLoans.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );

  return {
    revenue,
    cogs,
    expenses: expensesTotal,
    loans: loansTotal,
    grossProfit: revenue - cogs,
    netProfit: revenue - cogs - expensesTotal - loansTotal,
  };
}

export function getCashSummary({
  sessions,
  orders,
}: {
  sessions: CashSession[];
  orders: Order[];
}) {
  const activeSession = sessions.find((session) => session.status === "open");

  if (!activeSession) {
    return null;
  }

  const sessionOrders = orders.filter(
    (order) => new Date(order.createdAt) >= new Date(activeSession.openedAt),
  );
  const cashSales = sessionOrders
    .filter((order) => order.paymentMethod === "cash")
    .reduce((sum, order) => sum + order.total, 0);

  return {
    activeSession,
    cashSales,
    expectedCash: activeSession.openingCash + cashSales,
  };
}
