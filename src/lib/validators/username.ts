import { z } from "zod";
import { normalizeString } from "~/utils/normalizers";

export function normalizeUsername(v: string): string {
  return normalizeString(v);
}

export const USERNAME_RULES = {
  MIN_LENGTH: 5,
  MAX_LENGTH: 30,
  ALLOWED_CHARS: /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?$/,
  START_CHAR: /^[a-zA-Z0-9]/,
  END_CHAR: /[a-zA-Z0-9]$/,
  NO_SPACE: /\s+/,
  NO_REPEATED_SEPARATORS: /([._-])\1+/,
};

export function usernameSchema() {
  return z.preprocess(
    normalizeUsername,
    z
      .string()
      .min(USERNAME_RULES.MIN_LENGTH, {
        message: `Username minimal ${USERNAME_RULES.MIN_LENGTH} karakter`,
      })
      .max(USERNAME_RULES.MAX_LENGTH, {
        message: `Username maksimal ${USERNAME_RULES.MAX_LENGTH} karakter`,
      })
      .regex(USERNAME_RULES.ALLOWED_CHARS, {
        message: "Hanya boleh huruf, angka, titik, strip, dan underscore",
      })
      .regex(USERNAME_RULES.START_CHAR, {
        message: "Harus diawali dengan huruf atau angka",
      })
      .regex(USERNAME_RULES.END_CHAR, {
        message: "Harus diakhiri dengan huruf atau angka",
      })
      .refine((s) => !USERNAME_RULES.NO_REPEATED_SEPARATORS.test(s), {
        message: "Tidak boleh ada simbol berurutan",
      })
      .refine((s) => !USERNAME_RULES.NO_SPACE.test(s), {
        message: "Tidak boleh ada spasi",
      })
  );
}

export type UsernameSchema = z.infer<typeof usernameSchema>;
