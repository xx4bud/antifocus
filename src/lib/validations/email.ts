import { z } from "zod";
import { normalizeString } from "@/lib/utils/string";

// ==============================
// Rules
// ==============================

export const EMAIL_RULES = {
  MAX: 255,
} as const;

// ==============================
// Schemas
// ==============================

export const emailSchema = z
  .string()
  .email("Invalid email address")
  .max(EMAIL_RULES.MAX, `Email must be at most ${EMAIL_RULES.MAX} characters`)
  .toLowerCase()
  .trim()
  .transform(normalizeString);
