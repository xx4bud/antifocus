import z from "zod";
import { normalizeString } from "../utils";

export function normalizeEmail(v: string): string {
  return normalizeString(v).toLowerCase();
}

export const EMAIL_RULES = {
  MIN_LENGTH: 1,
  MAX_LENGTH: 254,
};

export function emailSchema() {
  return z.preprocess(
    normalizeEmail,
    z
      .email({ message: "Format email tidak valid" })
      .min(EMAIL_RULES.MIN_LENGTH, {
        message: "Email tidak boleh kosong",
      })
      .max(EMAIL_RULES.MAX_LENGTH, {
        message: `Email maksimal ${EMAIL_RULES.MAX_LENGTH} karakter`,
      })
  );
}

export function validEmail(v: string) {
  return emailSchema().safeParse(v);
}
