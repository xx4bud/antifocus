import type { BetterAuthOptions } from "better-auth";
import { sendResetPassword } from "@/lib/notifications/email/send-reset-password";
import { hashPassword, verifyPassword } from "../utils/password";

export const emailAndPassword = {
  enabled: true,
  autoSignIn: false,
  minPasswordLength: 8,
  maxPasswordLength: 128,
  password: {
    hash: hashPassword,
    verify: ({ password, hash }) => verifyPassword(password, hash),
  },
  requireEmailVerification: true,
  revokeSessionsOnPasswordReset: true,
  resetPasswordTokenExpiresIn: 60 * 60,
  sendResetPassword: async ({ user, url }) => {
    await sendResetPassword({
      email: user.email,
      url,
    });
  },
} satisfies BetterAuthOptions["emailAndPassword"];
