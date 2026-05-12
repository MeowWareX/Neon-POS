import { z } from "zod";

export const orderItemSchema = z.object({
  id: z.string(),
  sizeId: z.string(),
  typeId: z.string(),
  flavorId: z.string(),
  extraIds: z.array(z.string()),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
  unitCost: z.number().min(0),
  lineTotal: z.number().min(0),
});

export const orderSyncSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  paymentMethod: z.enum(["cash", "nequi", "daviplata", "transfer"]),
  subtotal: z.number().min(0),
  total: z.number().min(0),
  estimatedCost: z.number().min(0),
  syncState: z.enum(["local", "pending", "synced"]),
  createdAt: z.string(),
  items: z.array(orderItemSchema).min(1),
});

export type OrderSyncInput = z.infer<typeof orderSyncSchema>;
