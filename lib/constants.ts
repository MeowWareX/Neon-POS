export const APP_NAME = "NEON OS";
export const STORAGE_KEY = "neon-os-store";
export const AUTH_KEY = "neon-os-auth";
export const CATALOG_UPDATE_KEY = "neon-os-catalog-updated";
export const DEMO_PASSWORD = "123456";

export const PAYMENT_METHODS = ["cash", "nequi"] as const;

export const PRODUCT_TYPES = [
  "basico",
  "cremoso",
  "picoso",
  "gomitas-enchilada",
] as const;

export const PRODUCT_SIZES = [
  "8oz",
  "12oz",
  "16oz",
  "3k",
  "6k",
  "10k",
] as const;
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

export interface LiquidPriceSuggestion {
  total: number;
  unitPrice: number;
  tierLabel: string;
}

export function getSuggestedLiquidPrice(
  variant: LiquidVariantCode,
  quantity: number,
): LiquidPriceSuggestion {
  const config = LIQUID_VARIANT_CONFIG[variant];
  const hasAlcohol = config?.hasAlcohol ?? false;

  if (hasAlcohol) {
    if (quantity >= 10) {
      return {
        total: 30000 * quantity,
        unitPrice: 30000,
        tierLabel: "Tarifa Mayorista (≥10 unid)",
      };
    }
    if (quantity >= 6) {
      const unitPrice = Math.round(200000 / 6);
      return {
        total: Math.round((200000 / 6) * quantity),
        unitPrice,
        tierLabel: "Tarifa Mayorista (≥6 unid)",
      };
    }
    return {
      total: 35000 * quantity,
      unitPrice: 35000,
      tierLabel: "Tarifa Estándar Detal",
    };
  } else {
    if (quantity >= 10) {
      return {
        total: 26000 * quantity,
        unitPrice: 26000,
        tierLabel: "Tarifa Mayorista (≥10 unid)",
      };
    }
    if (quantity >= 6) {
      const unitPrice = Math.round(170000 / 6);
      return {
        total: Math.round((170000 / 6) * quantity),
        unitPrice,
        tierLabel: "Tarifa Mayorista (≥6 unid)",
      };
    }
    return {
      total: 30000 * quantity,
      unitPrice: 30000,
      tierLabel: "Tarifa Estándar Detal",
    };
  }
}
