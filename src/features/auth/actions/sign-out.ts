"use server";

import { headers } from "next/headers";
import { auth } from "~/lib/auth";
import { parseError } from "~/utils/error";
import type { AppResponse } from "~/utils/types";

export async function signOut(): Promise<AppResponse<void>> {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: parseError(error),
    };
  }
}
