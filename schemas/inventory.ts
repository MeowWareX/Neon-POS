import { z } from "zod";

export const inventoryMovementSchema = z.object({
  inventoryItemId: z.string().min(1),
  type: z.enum(["purchase", "adjustment", "waste"]),
  quantity: z.coerce.number().min(1),
  note: z.string().min(2),
});

export const purchaseSchema = z.object({
  inventoryItemId: z.string().min(1),
  vendor: z.string().min(2),
  quantity: z.coerce.number().min(1),
  total: z.coerce.number().min(0),
  note: z.string().optional(),
});

export const inventoryMovementSyncSchema = inventoryMovementSchema.extend({
  id: z.string(),
  quantity: z.number(),
  createdAt: z.string(),
});

export const purchaseSyncSchema = purchaseSchema.extend({
  id: z.string(),
  createdAt: z.string(),
});
