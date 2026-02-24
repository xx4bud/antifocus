import { emailOTP } from "better-auth/plugins";

export function emailOTPPlugin() {
  return emailOTP({
    async sendVerificationOTP({ email, otp, type }) {
      // TODO: integrate with your email service (e.g. nodemailer/react-email)
      console.log(`[EMAIL OTP] ${type} → ${email}: ${otp}`);
    },
  });
}
