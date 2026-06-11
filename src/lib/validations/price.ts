import { z } from "zod";

export const PRICE_RULES = {
  /** Decimal(15, 2) — max 13 integer digits + 2 decimal */
  PRECISION: 15,
  SCALE: 2,
  MIN: 0,
  /** Matches decimal numbers like "150000.00", "0.5", "99999" */
  REGEX: /^\d{1,13}(\.\d{1,2})?$/,
} as const;

/**
 * Price schema matching moneyColumn (DECIMAL(15, 2) mode: "number").
 * We use z.coerce.number() to gracefully handle form inputs (which are often strings),
 * while remaining fully compatible with Drizzle's numeric output.
 */
export const priceSchema = z.coerce
  .number()
  .nonnegative("Price must be zero or positive")
  .max(
    10 ** (PRICE_RULES.PRECISION - PRICE_RULES.SCALE) - 1,
    "Price is too large"
  );

/**
 * Optional price schema mapping empty strings to undefined.
 */
export const optionalPriceSchema = z.preprocess(
  (val) => (val === "" ? undefined : val),
  priceSchema.optional()
);

/**
 * Compare-at price (optional, for sale displays).
 */
export const compareAtPriceSchema = optionalPriceSchema;
