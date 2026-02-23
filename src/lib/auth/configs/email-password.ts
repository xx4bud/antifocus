import type { BetterAuthOptions } from "better-auth";
import { sendResetPasswordEmail } from "~/features/email/actions/send-reset-password-email";
import { hashPassword, verifyPassword } from "~/lib/auth/configs/password";

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
  resetPasswordTokenExpiresIn: 60 * 60,
  sendResetPassword: async ({ user, url }) => {
    await sendResetPasswordEmail({
      to: user.email,
      username: user.name || "User",
      resetUrl: url.toString(),
    });
  },
} satisfies BetterAuthOptions["emailAndPassword"];
