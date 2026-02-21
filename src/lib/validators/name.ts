import { z } from "zod";
import { normalizeString } from "~/utils/normalizers";

export function normalizeName(v: string): string {
  return normalizeString(v).replace(/\s+/g, " ");
}

export const NAME_RULES = {
  MIN_LENGTH: 1,
  MAX_LENGTH: 150,
  MUST_LETTER: /\p{L}/u,
  ALLOWED_CHARS: /^[\p{L}\p{M} .'-]+$/u,
  NO_EDGE_PUNCT: /^[\p{L}\p{M}].*[\p{L}\p{M}]$/u,
  NO_REPEATED_PUNCT: /[ .'-]{2,}/,
};

export function nameSchema() {
  return z.preprocess(
    normalizeName,
    z
      .string()
      .min(NAME_RULES.MIN_LENGTH, {
        message: "Nama tidak boleh kosong",
      })
      .max(NAME_RULES.MAX_LENGTH, {
        message: `Nama maksimal ${NAME_RULES.MAX_LENGTH} karakter`,
      })
      .regex(NAME_RULES.MUST_LETTER, {
        message: "Nama harus mengandung huruf",
      })
      .regex(NAME_RULES.ALLOWED_CHARS, {
        message: "Nama mengandung karakter tidak valid",
      })
      .regex(NAME_RULES.NO_EDGE_PUNCT, {
        message: "Nama tidak boleh diawali atau diakhiri simbol",
      })
      .refine((s) => !NAME_RULES.NO_REPEATED_PUNCT.test(s), {
        message: "Nama tidak boleh mengandung simbol berurutan",
      })
  );
}

export type NameSchema = z.infer<typeof nameSchema>;
