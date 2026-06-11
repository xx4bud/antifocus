import { z } from "zod";

export const RATE_RULES = {
  MIN: 0,
  MAX: 100,
  /** Decimal(5, 2) — max 3 integer digits + 2 decimal */
  PRECISION: 5,
  SCALE: 2,
} as const;

/** Percentage rate 0-100 (TaxRate, discount percentage) */
export const rateSchema = z.coerce
  .number()
  .min(RATE_RULES.MIN, "Rate must be at least 0")
  .max(RATE_RULES.MAX, "Rate must be at most 100");

/** Rating 0-5 with 2 decimal places (Branch, Product) — Decimal(3, 2) */
export const ratingSchema = z.coerce
  .number()
  .min(0, "Rating must be at least 0")
  .max(5, "Rating must be at most 5");
