import type { BetterAuthOptions } from "better-auth";
import { sendVerifyEmail } from "~/features/email/actions/send-verify-email";

export const emailVerification = {
  sendOnSignUp: true,
  expiresIn: 60 * 60,
  autoSignInAfterVerification: true,

  sendVerificationEmail: async ({ user, url }) => {
    const link = new URL(url);
    link.searchParams.set("callbackURL", "/verify-email");

    await sendVerifyEmail({
      to: user.email,
      username: user.name || "User",
      verifyUrl: link.toString(),
    });
  },
} satisfies BetterAuthOptions["emailVerification"];
