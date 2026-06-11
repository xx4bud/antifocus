import { z } from "zod";
import { RESERVED_WORDS } from "@/lib/utils/constants";

export const SLUG_RULES = {
  MAX: 255,
  /** Lowercase alphanumeric with dashes */
  REGEX: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
} as const;

/**
 * Validate and clean URL-friendly slug.
 */
export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(SLUG_RULES.MAX, `Slug must be at most ${SLUG_RULES.MAX} characters`)
  .regex(
    SLUG_RULES.REGEX,
    "Slug must contain only lowercase letters, numbers, and dashes"
  )
  .refine((val) => !(RESERVED_WORDS as readonly string[]).includes(val), {
    message: "This slug is reserved and cannot be used",
  });

/**
 * Optional URL-friendly slug, mapping empty strings to undefined.
 */
export const optionalSlugSchema = z
  .string()
  .trim()
  .transform((val) => (val === "" ? undefined : val))
  .pipe(slugSchema.optional());
