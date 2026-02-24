import { captcha } from "better-auth/plugins";

export function captchaPlugin() {
  return captcha({
    provider: "cloudflare-turnstile", // or google-recaptcha, hcaptcha, captchafox
    secretKey: String(process.env.TURNSTILE_SECRET_KEY),
  });
}
