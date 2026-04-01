import z from "zod";
import { normalizeString } from "../utils";

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
        message: `Nama minimal ${NAME_RULES.MIN_LENGTH} karakter`,
      })
      .max(NAME_RULES.MAX_LENGTH, {
        message: `Nama maksimal ${NAME_RULES.MAX_LENGTH} karakter`,
      })
      .regex(NAME_RULES.MUST_LETTER, {
        message: "Nama harus mengandung setidaknya satu huruf",
      })
      .regex(NAME_RULES.ALLOWED_CHARS, {
        message: "Nama mengandung karakter yang tidak diizinkan",
      })
      .regex(
        NAME_RULES.NO_EDGE_PUNCT,
        "Nama tidak boleh diawali atau diakhiri dengan tanda baca"
      )
      .refine((s) => !NAME_RULES.NO_REPEATED_PUNCT.test(s), {
        message: "Nama tidak boleh mengandung tanda baca berulang",
      })
  );
}

export function validName(v: string) {
  return nameSchema().safeParse(v);
}
