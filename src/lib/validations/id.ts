import { z } from "zod";

// ==============================
// Rules
// ==============================

export const ID_RULES = {
  FORMAT: "cuid2",
} as const;

// ==============================
// Schemas
// ==============================

export const idSchema = z.cuid2("Invalid ID format");

export const idArraySchema = z
  .array(idSchema)
  .min(1, "At least one ID required");

export const optionalIdSchema = idSchema.optional();
