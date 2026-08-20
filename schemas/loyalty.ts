import { z } from "zod";

export const loyaltyRegisterSchema = z.object({
  fullName: z.string().min(1, "Name is required").max(200),
  phone: z.string().min(7).max(20),
  email: z.string().email("Invalid email").optional(),
});

export type LoyaltyRegisterInput = z.infer<typeof loyaltyRegisterSchema>;

export const loyaltyStampSchema = z.object({
  passToken: z.string().uuid("Invalid pass token").optional(),
  phone: z.string().min(7).max(20).optional(),
  orderId: z.string().uuid("Invalid order ID").optional(),
  stampsToAdd: z.number().int().min(-8).max(10),
  redeemReward: z.boolean().optional(),
});

export type LoyaltyStampInput = z.infer<typeof loyaltyStampSchema>;
