import { z } from "zod";
import { passwordSchema } from "~/lib/validators/password";

export function resetPasswordSchema() {
  return z
    .object({
      token: z.string().min(1, { message: "Token tidak valid" }),
      password: passwordSchema(),
      confirmPassword: z
        .string()
        .min(1, { message: "Konfirmasi kata sandi wajib diisi" }),
    })
    .refine((d) => d.password === d.confirmPassword, {
      message: "Konfirmasi kata sandi tidak cocok",
      path: ["confirmPassword"],
    });
}

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export const resetPasswordInput = resetPasswordSchema();

export type ResetPasswordData = z.infer<typeof resetPasswordInput>;
