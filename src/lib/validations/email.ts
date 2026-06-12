import { z } from "zod";
import { normalizeString } from "@/lib/utils/normalizer";

export const EMAIL_RULES = {
  MAX: 255,
} as const;

/**
 * Validate and normalize email address.
 */
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .transform(normalizeString)
  .pipe(
    z
      .string()
      .email("Invalid email address")
      .max(
        EMAIL_RULES.MAX,
        `Email must be at most ${EMAIL_RULES.MAX} characters`
      )
  );
