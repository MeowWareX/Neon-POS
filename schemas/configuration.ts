import { z } from "zod";

export const productSizeSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().min(1),
  label: z.string().min(1),
  ounces: z.number().int().positive(),
  price: z.number().int().nonnegative(),
  baseCost: z.number().int().nonnegative(),
  inventoryItemId: z.string().uuid().optional().nullable(),
  usageQuantity: z.number().positive().optional().default(1),
});

export const productTypeSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().min(1),
  label: z.string().min(1),
  priceModifier: z.number().int(),
  costModifier: z.number().int(),
  inventoryItemId: z.string().uuid().optional().nullable(),
  usageQuantity: z.number().positive().optional().default(1),
});

export const extraSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  price: z.number().int().nonnegative(),
  cost: z.number().int().nonnegative(),
  inventoryItemId: z.string().uuid().optional().nullable(),
  usageQuantity: z.number().positive().optional().default(1),
});

export const flavorSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  isActive: z.boolean(),
});

export const configurationUpdateSchema = z.object({
  sizes: z.array(productSizeSchema).optional(),
  productTypes: z.array(productTypeSchema).optional(),
  extras: z.array(extraSchema).optional(),
  flavors: z.array(flavorSchema).optional(),
});

export type ProductSize = z.infer<typeof productSizeSchema>;
export type ProductType = z.infer<typeof productTypeSchema>;
export type Extra = z.infer<typeof extraSchema>;
export type Flavor = z.infer<typeof flavorSchema>;
export type ConfigurationUpdate = z.infer<typeof configurationUpdateSchema>;
