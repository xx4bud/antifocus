import { z } from "zod";
import { passwordSchema } from "~/lib/validators/password";

export function changePasswordSchema() {
  return z
    .object({
      currentPassword: z.string().min(1, {
        message: "Kata sandi saat ini wajib diisi",
      }),
      newPassword: passwordSchema(),
      confirmPassword: z.string().min(1, {
        message: "Konfirmasi kata sandi wajib diisi",
      }),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
      message: "Konfirmasi kata sandi tidak cocok",
      path: ["confirmPassword"],
    })
    .refine((d) => d.currentPassword !== d.newPassword, {
      message: "Kata sandi baru harus berbeda dari kata sandi saat ini",
      path: ["newPassword"],
    });
}

export const changePasswordInput = changePasswordSchema();

export type ChangePasswordData = z.infer<typeof changePasswordInput>;
