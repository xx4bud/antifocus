import { twoFactor } from "better-auth/plugins/two-factor";
import React from "react";
import { FROM_EMAIL, sendEmail } from "@/lib/email";
import { OtpEmail } from "@/lib/email/templates/otp-email";
import { APP_NAME } from "@/lib/utils/constants";

export const twoFactorPlugin = twoFactor({
  issuer: APP_NAME,
  totpOptions: {
    digits: 6,
    period: 30,
  },
  otpOptions: {
    sendOTP: async ({ user, otp }) => {
      await sendEmail({
        from: FROM_EMAIL,
        to: user.email,
        subject: "Your verification code",
        react: React.createElement(OtpEmail, { otp, userName: user.name }),
      });
    },
    period: 5, // Code validity in minutes
    allowedAttempts: 5,
    storeOTP: "encrypted",
  },
  backupCodeOptions: {
    amount: 10,
    length: 10,
    storeBackupCodes: "encrypted",
  },
  twoFactorCookieMaxAge: 600, // 10 minutes
  trustDeviceMaxAge: 30 * 24 * 60 * 60, // 30 days
});
