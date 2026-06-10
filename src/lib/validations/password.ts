import { z } from "zod";

// ==============================
// Rules
// ==============================

export const PASSWORD_RULES = {
  MIN: 8,
  MAX: 128,
  /** At least one uppercase, one lowercase, and one number */
  REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
} as const;

// ==============================
// Schemas
// ==============================

export const passwordSchema = z
  .string()
  .min(
    PASSWORD_RULES.MIN,
    `Password must be at least ${PASSWORD_RULES.MIN} characters`
  )
  .max(
    PASSWORD_RULES.MAX,
    `Password must be at most ${PASSWORD_RULES.MAX} characters`
  )
  .regex(
    PASSWORD_RULES.REGEX,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  );

// ==============================
// Helpers
// ==============================

/**
 * Refine helper to validate confirmPassword matches password.
 * Usage: z.object({ password, confirmPassword }).refine(...confirmPasswordRefine)
 */
export const confirmPasswordRefine = [
  (data: { password: string; confirmPassword: string }) =>
    data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"] as string[],
  },
] as const;
