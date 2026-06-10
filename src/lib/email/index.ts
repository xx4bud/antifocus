import { render } from "react-email";
import { type CreateEmailOptions, Resend } from "resend";
import { env } from "@/env";
import { APP_DOMAIN, APP_NAME } from "@/lib/utils/constants";
import { createError } from "../utils/error";
import { type AppResult, tryCatchAsync } from "../utils/result";

let _resend: Resend | null = null;

export const getResend = (): Resend => {
  if (!_resend) {
    _resend = new Resend(env.RESEND_API_KEY);
  }
  return _resend;
};

export const resend = new Proxy({} as Resend, {
  get: (_, prop) => getResend()[prop as keyof Resend],
});

export const FROM_EMAIL = `${APP_NAME} <hallo@${APP_DOMAIN}>`;

export function sendEmail(options: CreateEmailOptions): Promise<
  AppResult<{
    id: string;
  }>
> {
  return tryCatchAsync(
    async () => {
      let finalHtml = options.html;

      if (options.react) {
        finalHtml = await render(options.react);
      }

      const payload = {
        from: options.from ?? FROM_EMAIL,
        to: options.to,
        subject: options.subject,
        ...(finalHtml ? { html: finalHtml } : {}),
        ...(options.text ? { text: options.text } : {}),
        ...(options.replyTo ? { replyTo: options.replyTo } : {}),
      } as CreateEmailOptions;

      const { data, error } = await resend.emails.send(payload);

      if (error) {
        throw new Error(error.message);
      }

      console.log(
        `[Email Service] ${data.id} - ${options.to} - ${options.subject}`
      );

      return { id: data.id };
    },
    (error) =>
      createError(
        "INTERNAL_ERROR",
        error instanceof Error
          ? `Failed to send email: ${error.message}`
          : "Failed to send email",
        500,
        { options: { ...options, react: !!options.react } }
      )
  );
}
