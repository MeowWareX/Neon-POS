import { z } from "zod";

export const expenseSchema = z.object({
  concept: z.string().min(2),
  amount: z.coerce.number().min(0),
  category: z.string().min(2),
});

export const loanPaymentSchema = z.object({
  lender: z.string().min(2),
  amount: z.coerce.number().min(0),
  balanceAfterPayment: z.coerce.number().min(0),
});

export const expenseSyncSchema = expenseSchema.extend({
  id: z.string(),
  createdAt: z.string(),
});

export const loanPaymentSyncSchema = loanPaymentSchema.extend({
  id: z.string(),
  createdAt: z.string(),
});
