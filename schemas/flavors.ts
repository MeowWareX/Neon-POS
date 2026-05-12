import { z } from "zod";

export const activeFlavorSyncSchema = z.object({
  flavorId: z.string().min(1),
  tankNumber: z.union([z.literal(1), z.literal(2), z.literal(3), z.null()]),
  businessDate: z.string().min(1),
});
