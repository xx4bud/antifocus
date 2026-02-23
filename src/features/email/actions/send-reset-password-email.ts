"use server";

import { ResetPasswordEmail } from "../components/reset-password-email";
import { sendEmail } from "./send-email";

export async function sendResetPasswordEmail({
  to,
  username,
  resetUrl,
}: {
  to: string;
  username: string;
  resetUrl: string;
}) {
  return sendEmail({
    to,
    subject: "Reset Password",
    html: ResetPasswordEmail({
      username,
      resetUrl,
      userEmail: to,
    }),
  });
}
