"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { parseError } from "@/lib/utils/errors";
import type { AppResponse } from "@/lib/utils/types";

/**
 * Server action for user logout with layered architecture.
 */
export async function signOutAction(): Promise<AppResponse<undefined>> {
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
