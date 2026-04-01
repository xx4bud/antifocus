"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { parseError } from "@/lib/utils/errors";
import type { AppResponse } from "@/lib/utils/types";

export type SocialProvider = "google" | "github" | "discord";

/**
 * Server action for starting a social OAuth flow.
 * Now supports multiple providers and provides explicit type safety for the redirect URL.
 */
export async function signInSocialAction(
  provider: SocialProvider,
  callbackUrl: string
): Promise<AppResponse<{ url: string }>> {
  try {
    const result = await auth.api.signInSocial({
      body: { provider, callbackURL: callbackUrl },
      headers: await headers(),
    });

    if (result?.url) {
      return {
        success: true,
        data: { url: result.url },
      };
    }

    return {
      success: false,
      error: {
        code: "NO_REDIRECT_URL",
        message: "Gagal mendapatkan URL redirect dari provider sosial",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: parseError(error),
    };
  }
}
