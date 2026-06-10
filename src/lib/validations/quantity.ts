import { z } from "zod";

// ==============================
// Rules
// ==============================

export const QUANTITY_RULES = {
  MIN: 0,
} as const;

// ==============================
// Schemas
// ==============================

/** General non-negative quantity (inventory, min/maxOrder) */
export const quantitySchema = z
  .number()
  .nonnegative("Quantity must be zero or positive");

/** Positive quantity required (order items, purchase items) */
export const positiveQuantitySchema = z
  .number()
  .positive("Quantity must be greater than zero");

/** Integer quantity (reviewCount, viewCount, saleCount, increment, padding) */
export const intQuantitySchema = z
  .number()
  .int("Must be a whole number")
  .nonnegative("Must be zero or positive");
