import { env } from "@antifocus/env";
import { findIp } from "@arcjet/ip";
import arcjet, {
  type BotOptions,
  detectBot,
  type EmailOptions,
  protectSignup,
  type SlidingWindowRateLimitOptions,
  shield,
  slidingWindow,
} from "@arcjet/next";
import type { BetterAuth } from ".";

const aj = arcjet({
  key: env.ARCJET_KEY,
  rules: [shield({ mode: "LIVE" })],
  characteristics: ["userIdOrIp"],
});

const botSettings = { mode: "LIVE", allow: [] } satisfies BotOptions;

const restrictiveRateLimitSettings = {
  mode: "LIVE",
  max: 10,
  interval: "10m",
} as SlidingWindowRateLimitOptions<[]>;

const laxRateLimitSettings = {
  mode: "LIVE",
  max: 60,
  interval: "1m",
} as SlidingWindowRateLimitOptions<[]>;

const emailSettings = {
  mode: "LIVE",
  deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
} satisfies EmailOptions;

export async function checkArcjet(req: Request, auth: BetterAuth) {
  const body = (await req.json()) as unknown;
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  const userIdOrIp = (session?.user?.id ?? findIp(req)) || "127.0.0.1";

  if (req.url.endsWith("/auth/sign-up")) {
    if (
      body &&
      typeof body === "object" &&
      "email" in body &&
      typeof body.email === "string"
    ) {
      return aj
        .withRule(
          protectSignup({
            email: emailSettings,
            bots: botSettings,
            rateLimit: restrictiveRateLimitSettings,
          })
        )
        .protect(req, { email: body.email, userIdOrIp });
    }
    return aj
      .withRule(detectBot(botSettings))
      .withRule(slidingWindow(restrictiveRateLimitSettings))
      .protect(req, { userIdOrIp });
  }

  return aj
    .withRule(detectBot(botSettings))
    .withRule(slidingWindow(laxRateLimitSettings))
    .protect(req, {
      userIdOrIp,
    });
}
