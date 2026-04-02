import type { BetterAuthOptions } from "better-auth";
import { sendVerificationEmail } from "@/lib/notifications/email/send-verification-email";

export const emailVerification = {
  sendOnSignUp: true,
  expiresIn: 60 * 60, // 1 hour
  autoSignInAfterVerification: true,
  sendVerificationEmail: async ({ user, url }) => {
    await sendVerificationEmail({
      email: user.email,
      url,
    });
  },
} satisfies BetterAuthOptions["emailVerification"];
