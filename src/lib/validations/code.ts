import { z } from "zod";
import { normalizeAlphanumeric } from "@/lib/utils/string";

// ==============================
// Rules
// ==============================

export const CODE_RULES = {
  MAX: 255,
} as const;

// ==============================
// Schemas
// ==============================

/** Generic code field (Branch code, Customer code, TaxRate code, PaymentMethod code) */
export const codeSchema = z
  .string()
  .max(CODE_RULES.MAX, `Code must be at most ${CODE_RULES.MAX} characters`)
  .trim()
  .transform(normalizeAlphanumeric);

/** SKU field (Variant) */
export const skuSchema = z
  .string()
  .max(CODE_RULES.MAX, `SKU must be at most ${CODE_RULES.MAX} characters`)
  .trim()
  .transform(normalizeAlphanumeric);

/** Barcode field (Variant) */
export const barcodeSchema = z
  .string()
  .max(CODE_RULES.MAX, `Barcode must be at most ${CODE_RULES.MAX} characters`)
  .trim()
  .transform(normalizeAlphanumeric);

export const optionalCodeSchema = z
  .string()
  .trim()
  .transform((val) => (val === "" ? undefined : val))
  .pipe(codeSchema.optional());
