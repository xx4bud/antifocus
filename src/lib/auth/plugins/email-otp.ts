import { emailOTP } from "better-auth/plugins";
import React from "react";
import { FROM_EMAIL, sendEmail } from "@/lib/email";
import { OtpEmail } from "@/lib/email/templates/otp-email";

export const emailOTPPlugin = emailOTP({
  async sendVerificationOTP({ email, otp, type }) {
    let subject = "Your Verification Code";

    if (type === "sign-in") {
      subject = "Sign in to your account";
    } else if (type === "email-verification") {
      subject = "Verify your email address";
    } else if (type === "forget-password") {
      subject = "Reset your password";
    }

    await sendEmail({
      from: FROM_EMAIL,
      to: email,
      subject,
      react: React.createElement(OtpEmail, {
        otp,
        userName: "there",
      }),
    });
  },
});
