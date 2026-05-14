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

export const inventoryItemSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  unit: z.string().min(1),
  category: z.string().optional().nullable(),
  reorderPoint: z.number().int().nonnegative().optional().default(0),
  unitCost: z.number().int().nonnegative().optional().default(0),
});

export const inventoryConsumptionRuleSchema = z.object({
  id: z.string().uuid().optional(),
  productTypeId: z.string().uuid().optional().nullable(),
  productSizeId: z.string().uuid().optional().nullable(),
  extraId: z.string().uuid().optional().nullable(),
  consumesSelectedFlavor: z.boolean().default(false),
  inventoryItemId: z.string().uuid().optional().nullable(),
  quantity: z.number().positive(),
  note: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
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
export type InventoryItem = z.infer<typeof inventoryItemSchema>;
export type InventoryConsumptionRuleInput = z.infer<
  typeof inventoryConsumptionRuleSchema
>;
export type ConfigurationUpdate = z.infer<typeof configurationUpdateSchema>;
