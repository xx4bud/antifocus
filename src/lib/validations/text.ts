import { z } from "zod";
import { normalizeString } from "@/lib/utils/string";

// ==============================
// Rules
// ==============================

export const TEXT_RULES = {
  SHORT_MAX: 255,
  MEDIUM_MAX: 5000,
  LONG_MAX: 10_000,
} as const;

// ==============================
// Schemas
// ==============================

/** Short text (titles, labels) */
export const shortTextSchema = z
  .string()
  .max(
    TEXT_RULES.SHORT_MAX,
    `Must be at most ${TEXT_RULES.SHORT_MAX} characters`
  )
  .trim()
  .transform(normalizeString);

/** Medium text (descriptions, notes) */
export const textSchema = z
  .string()
  .max(
    TEXT_RULES.MEDIUM_MAX,
    `Must be at most ${TEXT_RULES.MEDIUM_MAX} characters`
  )
  .trim()
  .transform(normalizeString);

/** Long text (rich content, body) */
export const descriptionSchema = z
  .string()
  .max(TEXT_RULES.LONG_MAX, `Must be at most ${TEXT_RULES.LONG_MAX} characters`)
  .trim()
  .transform(normalizeString);

/** Notes field (optional medium text) */
export const notesSchema = textSchema.optional();
