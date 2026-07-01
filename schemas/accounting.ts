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

export const treasuryTransferSchema = z
  .object({
    fromAccountId: z.string().min(1, "Selecciona la cuenta de origen"),
    toAccountId: z.string().min(1, "Selecciona la cuenta de destino"),
    amount: z.coerce.number().positive("El monto debe ser mayor a 0"),
    note: z.string().min(2, "Escribe una descripción o razón del traslado"),
  })
  .refine((data) => data.fromAccountId !== data.toAccountId, {
    message: "El origen y el destino deben ser diferentes",
    path: ["toAccountId"],
  });

export const historicalDaySchema = z.object({
  date: z.string().min(1, "Selecciona la fecha del día"),
  unitsSold: z.coerce.number().min(0, "Las unidades no pueden ser negativas"),
  totalCash: z.coerce.number().min(0, "El efectivo no puede ser negativo"),
  totalDigital: z.coerce.number().min(0, "El digital no puede ser negativo"),
  nextDayBase: z.coerce.number().min(0, "La base no puede ser negativa"),
  estimatedCost: z.coerce.number().min(0).optional(),
});
