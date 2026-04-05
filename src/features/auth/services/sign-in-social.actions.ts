"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { parseError } from "@/lib/utils/error";
import type { AppResponse } from "@/lib/utils/types";
import type { SignInSocialSchema } from "../models/validators";

export async function signInSocialAction(
  data: SignInSocialSchema
): Promise<AppResponse<{ url: string }>> {
  try {
    const { provider, callbackURL } = data;

    const result = await auth.api.signInSocial({
      body: { provider, callbackURL },
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
