"use server";

import { render } from "@react-email/components";
import { env } from "~/env";
import { transporter } from "~/lib/email";
import { parseError } from "~/utils/error";
import type { AppResponse, EmailOptions } from "~/utils/types";

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
  replyTo,
}: EmailOptions): Promise<AppResponse<string>> => {
  console.log(`Send "${subject}" email to:`, to);

  try {
    const emailHtml = await render(html);

    const emailOptions = {
      from: env.SMTP_USER || '"Antifocus" <noreply@antifocus.com>',
      to,
      subject,
      html: emailHtml,
      text,
      replyTo,
    };

    const result = await transporter.sendMail(emailOptions);

    return {
      success: true,
      data: result.messageId,
    };
  } catch (error) {
    console.error("Failed to send email:", error);
    return {
      success: false,
      error: parseError(error),
    };
  }
};
