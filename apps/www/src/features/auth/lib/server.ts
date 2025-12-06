import { initAuth } from "@antifocus/auth";
import { nextCookies } from "@antifocus/auth/nextjs";
import { env } from "@antifocus/env";
import { getBaseUrl } from "~/lib/url";

export const auth = initAuth({
  baseUrl: getBaseUrl(),
  productionUrl: getBaseUrl(),
  secret: env.AUTH_SECRET,
  googleClientId: env.GOOGLE_CLIENT_ID,
  googleClientSecret: env.GOOGLE_CLIENT_SECRET,
  extraPlugins: [nextCookies()],
});
