import { z } from "zod";

export const QUANTITY_RULES = {
  MIN: 0,
} as const;

/** General non-negative quantity (inventory, min/maxOrder) */
export const quantitySchema = z.coerce
  .number()
  .nonnegative("Quantity must be zero or positive");

/** Positive quantity required (order items, purchase items) */
export const positiveQuantitySchema = z.coerce
  .number()
  .positive("Quantity must be greater than zero");

/** Integer quantity (reviewCount, viewCount, saleCount, increment, padding) */
export const intQuantitySchema = z.coerce
  .number()
  .int("Must be a whole number")
  .nonnegative("Must be zero or positive");
