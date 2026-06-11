import { z } from "zod";
import { normalizeAlphanumeric } from "@/lib/utils/normalizer";

export const CODE_RULES = {
  MAX: 255,
} as const;

/** Generic code field (Branch code, Customer code, TaxRate code, PaymentMethod code) */
export const codeSchema = z
  .string()
  .trim()
  .transform(normalizeAlphanumeric)
  .pipe(
    z
      .string()
      .min(1, "Code cannot be empty")
      .max(CODE_RULES.MAX, `Code must be at most ${CODE_RULES.MAX} characters`)
  );

/** SKU field (Variant) */
export const skuSchema = z
  .string()
  .trim()
  .transform(normalizeAlphanumeric)
  .pipe(
    z
      .string()
      .min(1, "SKU cannot be empty")
      .max(CODE_RULES.MAX, `SKU must be at most ${CODE_RULES.MAX} characters`)
  );

/** Barcode field (Variant) */
export const barcodeSchema = z
  .string()
  .trim()
  .transform(normalizeAlphanumeric)
  .pipe(
    z
      .string()
      .min(1, "Barcode cannot be empty")
      .max(
        CODE_RULES.MAX,
        `Barcode must be at most ${CODE_RULES.MAX} characters`
      )
  );

/**
 * Optional code schema, mapping empty strings to undefined.
 */
export const optionalCodeSchema = z
  .string()
  .trim()
  .transform((val) => (val === "" ? undefined : val))
  .pipe(codeSchema.optional());
