import { z } from "zod";
import { RESERVED_WORDS } from "@/lib/utils/constants";
import { normalizeString } from "@/lib/utils/normalizer";

export const NAME_RULES = {
  MIN: 1,
  MAX: 100,
} as const;

const SPLIT_REGEX = /[^a-z0-9]+/;

/**
 * Validate, trim, and normalize full name strings.
 */
export const nameSchema = z
  .string()
  .trim()
  .transform(normalizeString)
  .pipe(
    z
      .string()
      .min(NAME_RULES.MIN, "Name is required")
      .max(NAME_RULES.MAX, `Name must be at most ${NAME_RULES.MAX} characters`)
  )
  .refine(
    (name) => {
      const lowerName = name.toLowerCase();
      const words = lowerName.split(SPLIT_REGEX);
      return !words.some((word) =>
        (RESERVED_WORDS as readonly string[]).includes(word)
      );
    },
    { message: "This name contains restricted system terms" }
  );
