export const APP_NAME = "NEON OS";
export const STORAGE_KEY = "neon-os-store";
export const AUTH_KEY = "neon-os-auth";
export const CATALOG_UPDATE_KEY = "neon-os-catalog-updated";
export const DEMO_PASSWORD = "123456";

export const PAYMENT_METHODS = ["cash", "nequi"] as const;

export const PRODUCT_TYPES = [
  "basico",
  "premium",
  "cremoso",
  "picoso",
] as const;

export const PRODUCT_SIZES = ["8oz", "12oz", "16oz"] as const;
export const USER_ROLES = ["operator", "admin"] as const;

export const LIQUID_VARIANTS = [
  "base_sin_licor",
  "base_con_licor",
  "cremoso_sin_licor",
  "cremoso_con_licor",
] as const;

export type LiquidVariantCode = (typeof LIQUID_VARIANTS)[number];

export const LIQUID_VARIANT_CONFIG: Record<
  LiquidVariantCode,
  { label: string; price: number; hasAlcohol: boolean; isCreamy: boolean }
> = {
  base_sin_licor: {
    label: "Base Sin Licor",
    price: 30000,
    hasAlcohol: false,
    isCreamy: false,
  },
  base_con_licor: {
    label: "Base Con Licor",
    price: 35000,
    hasAlcohol: true,
    isCreamy: false,
  },
  cremoso_sin_licor: {
    label: "Cremoso Sin Licor",
    price: 40000,
    hasAlcohol: false,
    isCreamy: true,
  },
  cremoso_con_licor: {
    label: "Cremoso Con Licor",
    price: 50000,
    hasAlcohol: true,
    isCreamy: true,
  },
};

export const LIQUID_YIELD_LITERS = 6;

