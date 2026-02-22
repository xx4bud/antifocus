import type { BetterAuthOptions } from "better-auth";

export const emailVerification = {
  sendOnSignUp: true,
  expiresIn: 60 * 60,
  autoSignInAfterVerification: true,

  // sendVerificationEmail: async ({ user, url }: { user: User; url: string }) => {
  //   const link = new URL(url);
  //   link.searchParams.set("callbackUrl", "/verify-email");

  //   await sendVerifyEmail({
  //     to: user.email,
  //     username: user.name || "User",
  //     verifyUrl: link.toString(),
  //   });
  // },
} satisfies BetterAuthOptions["emailVerification"];
