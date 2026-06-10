import { phoneNumber } from "better-auth/plugins";

export const phoneNumberPlugin = phoneNumber({
  otpLength: 6,
  expiresIn: 300, // 5 minutes
  allowedAttempts: 3,
  requireVerification: true,
  sendOTP: async ({ phoneNumber, code }) => {
    console.log(`🔑 OTP for ${phoneNumber}: ${code}`);
  },
  sendPasswordResetOTP: async ({ phoneNumber, code }) => {
    console.log(`🔑 Password Reset OTP for ${phoneNumber}: ${code}`);
  },
  signUpOnVerification: {
    getTempEmail: (phoneNumber) => `${phoneNumber}@temp.antifocus.my.id`,
    getTempName: (phoneNumber) => `User ${phoneNumber.slice(-4)}`,
  },
});
