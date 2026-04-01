import { Resend } from "resend";
import { env } from "@/env";

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
