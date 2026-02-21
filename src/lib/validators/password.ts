import z from "zod";

export const PASSWORD_RULES = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  UPPER_CASE: /[A-Z]/,
  LOWER_CASE: /[a-z]/,
  NUMBER: /[0-9]/,
  SYMBOL: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/,
  NO_REPEATED_CHAR: /(.)\1{2,}/,
  ALLOWED_CHARS: /^[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]+$/,
};

export function passwordSchema() {
  return z
    .string()
    .trim()
    .min(PASSWORD_RULES.MIN_LENGTH, {
      message: `Password minimal ${PASSWORD_RULES.MIN_LENGTH} karakter`,
    })
    .max(PASSWORD_RULES.MAX_LENGTH, {
      message: `Password maksimal ${PASSWORD_RULES.MAX_LENGTH} karakter`,
    })
    .regex(PASSWORD_RULES.ALLOWED_CHARS, {
      message: "Password mengandung karakter tidak valid",
    })
    .refine((s) => PASSWORD_RULES.UPPER_CASE.test(s), {
      message: "Password harus mengandung huruf besar",
    })
    .refine((s) => PASSWORD_RULES.LOWER_CASE.test(s), {
      message: "Password harus mengandung huruf kecil",
    })
    .refine((s) => PASSWORD_RULES.NUMBER.test(s), {
      message: "Password harus mengandung angka",
    })
    .refine((s) => PASSWORD_RULES.SYMBOL.test(s), {
      message: "Password harus mengandung simbol",
    })
    .refine((s) => !PASSWORD_RULES.NO_REPEATED_CHAR.test(s), {
      message: "Password tidak boleh mengandung karakter berurutan",
    });
}

export type PasswordSchema = z.infer<typeof passwordSchema>;
