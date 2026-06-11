import { z } from "zod";
import { RESERVED_WORDS } from "@/lib/utils/constants";

export const USERNAME_RULES = {
  MIN: 3,
  MAX: 30,
  /** Lowercase alphanumeric, underscores, dots. Must start with a letter. */
  REGEX: /^[a-z][a-z0-9._]{2,29}$/,
} as const;

/**
 * Validate and format usernames.
 */
export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(
    USERNAME_RULES.MIN,
    `Username must be at least ${USERNAME_RULES.MIN} characters`
  )
  .max(
    USERNAME_RULES.MAX,
    `Username must be at most ${USERNAME_RULES.MAX} characters`
  )
  .regex(
    USERNAME_RULES.REGEX,
    "Username must start with a letter and contain only lowercase letters, numbers, underscores, or dots"
  )
  .refine((val) => !(RESERVED_WORDS as readonly string[]).includes(val), {
    message: "This username is reserved and cannot be used",
  });

/**
 * Optional username schema, mapping empty strings to undefined.
 */
export const optionalUsernameSchema = z
  .string()
  .trim()
  .transform((val) => (val === "" ? undefined : val))
  .pipe(usernameSchema.optional());
