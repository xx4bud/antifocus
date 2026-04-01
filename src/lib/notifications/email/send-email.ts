import { isProduction } from "@/lib/utils";
import { resend } from "../resend";

export async function sendEmail({
  from = "Antifocus <hello@antifocus.my.id>",
  to,
  subject,
  html,
}: {
  from?: string;
  to: string | string[];
  subject: string;
  html: string;
}) {
  if (isProduction) {
    console.log(`🚀 [Email] Sending "${subject}" to: ${to}`);
  }

  return resend.emails.send({
    from,
    to,
    subject,
    html,
  });
}
