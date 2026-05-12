export const APP_NAME = "NEON OS";
export const STORAGE_KEY = "neon-os-store";
export const AUTH_KEY = "neon-os-auth";
export const CATALOG_UPDATE_KEY = "neon-os-catalog-updated";
export const DEMO_PASSWORD = "123456";

export const PAYMENT_METHODS = [
  "cash",
  "nequi",
] as const;

export const PRODUCT_TYPES = [
  "basico",
  "premium",
  "cremoso",
  "picoso",
] as const;

export const PRODUCT_SIZES = ["8oz", "12oz", "16oz"] as const;
export const USER_ROLES = ["operator", "admin"] as const;
