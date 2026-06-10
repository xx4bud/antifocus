import { z } from "zod";
import { normalizeString } from "@/lib/utils/string";

// ==============================
// Rules
// ==============================

export const SLUG_RULES = {
  MAX: 255,
  /** Lowercase alphanumeric with dashes */
  REGEX: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
} as const;

// ==============================
// Schemas
// ==============================

export const slugSchema = z
  .string()
  .max(SLUG_RULES.MAX, `Slug must be at most ${SLUG_RULES.MAX} characters`)
  .regex(
    SLUG_RULES.REGEX,
    "Slug must contain only lowercase letters, numbers, and dashes"
  )
  .toLowerCase()
  .trim()
  .transform(normalizeString);

export const optionalSlugSchema = z
  .string()
  .trim()
  .transform((val) => (val === "" ? undefined : val))
  .pipe(slugSchema.optional());
