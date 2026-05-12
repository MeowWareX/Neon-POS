import { z } from "zod";

export const openCashSchema = z.object({
  openingCash: z.coerce.number().min(0),
});

export const closeCashSchema = z.object({
  closingCash: z.coerce.number().min(0),
});

export const openCashSyncSchema = openCashSchema.extend({
  id: z.string(),
  openedAt: z.string(),
  status: z.literal("open"),
});

export const closeCashSyncSchema = z.object({
  id: z.string(),
  closingCash: z.number().min(0),
  expectedCash: z.number().min(0),
  difference: z.number(),
  closedAt: z.string(),
  status: z.literal("closed"),
});
