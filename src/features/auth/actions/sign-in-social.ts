"use server";

import { headers } from "next/headers";
import { auth } from "~/lib/auth";
import { parseError } from "~/utils/error";
import type { AppResponse } from "~/utils/types";

export async function signInSocial(
  provider: "google",
  callbackURL?: string
): Promise<AppResponse<string>> {
  try {
    const res = await auth.api.signInSocial({
      body: {
        provider,
        callbackURL,
      },
      headers: await headers(),
    });

    if (res?.url) {
      return {
        success: true,
        data: res.url,
      };
    }

    return {
      success: false,
      error: {
        message: "No redirect URL returned",
        code: "no_redirect_url",
        statusCode: 500,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: parseError(error),
    };
  }
}
