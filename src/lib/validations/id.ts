import { z } from "zod";

export const ID_RULES = {
  FORMAT: "cuid2",
} as const;

/**
 * Validate unique cuid2 identifier format.
 */
export const idSchema = z.cuid2("Invalid ID format");

/**
 * Validate a non-empty array of cuid2 identifiers.
 */
export const idArraySchema = z
  .array(idSchema)
  .min(1, "At least one ID required");

/**
 * Optional cuid2 identifier schema.
 */
export const optionalIdSchema = idSchema.optional();
