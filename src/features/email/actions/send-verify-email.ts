"use server";

import { VerifyEmail } from "../components/verify-email";
import { sendEmail } from "./send-email";

export async function sendVerifyEmail({
  to,
  username,
  verifyUrl,
}: {
  to: string;
  username: string;
  verifyUrl: string;
}) {
  return sendEmail({
    to,
    subject: "Verify Email",
    html: VerifyEmail({ username, verifyUrl }),
  });
}
