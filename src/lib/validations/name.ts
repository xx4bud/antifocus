import { z } from "zod";
import { normalizeString } from "@/lib/utils/string";

// ==============================
// Rules
// ==============================

export const NAME_RULES = {
  MIN: 1,
  MAX: 100,
} as const;

// ==============================
// Schemas
// ==============================

export const nameSchema = z
  .string()
  .min(NAME_RULES.MIN, "Name is required")
  .max(NAME_RULES.MAX, `Name must be at most ${NAME_RULES.MAX} characters`)
  .trim()
  .transform(normalizeString);
