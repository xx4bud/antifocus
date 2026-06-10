import type { BetterAuthOptions } from "better-auth";
import React from "react";
import { FROM_EMAIL, sendEmail } from "@/lib/email";
import { ResetPasswordEmail } from "@/lib/email/templates/reset-password";
import { hashPassword, verifyPassword } from "@/lib/utils/hash";

export const emailAndPassword: BetterAuthOptions["emailAndPassword"] = {
  enabled: true,
  autoSignIn: false, //defaults to true
  requireEmailVerification: true,
  resetPasswordTokenExpiresIn: 60 * 30, // 30 minutes
  minPasswordLength: 8,
  maxPasswordLength: 256,
  revokeSessionsOnPasswordReset: true,
  sendResetPassword: async ({ user, url }) => {
    await sendEmail({
      from: FROM_EMAIL,
      to: user.email,
      subject: "Reset your password",
      react: React.createElement(ResetPasswordEmail, {
        url,
        userName: user.name,
      }),
    });
  },
  password: {
    hash: async (password) => {
      const result = await hashPassword(password);
      return result.ok ? result.value : "";
    },
    verify: async ({ hash, password }) => {
      const result = await verifyPassword(hash, password);
      return result.ok ? result.value : false;
    },
  },
  customSyntheticUser: ({ coreFields, additionalFields, id }) => ({
    ...coreFields,
    role: "user",
    banned: false,
    banReason: null,
    banExpires: null,
    ...additionalFields,
    id,
  }),
};
