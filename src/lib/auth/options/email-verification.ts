import type { BetterAuthOptions } from "better-auth";
import React from "react";
import { FROM_EMAIL, sendEmail } from "@/lib/email";
import { VerifyEmail } from "@/lib/email/templates/verify-email";

export const emailVerification: BetterAuthOptions["emailVerification"] = {
  sendVerificationEmail: async ({ user, url }) => {
    await sendEmail({
      from: FROM_EMAIL,
      to: user.email,
      subject: "Verify your email address",
      react: React.createElement(VerifyEmail, { url, userName: user.name }),
    });
  },
};
