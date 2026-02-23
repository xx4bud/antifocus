"use server";

import { headers } from "next/headers";
import { auth } from "~/lib/auth";
import { parseError } from "~/utils/error";
import type { AppResponse } from "~/utils/types";

export async function changeEmail(
  newEmail: string
): Promise<AppResponse<unknown>> {
  try {
    if (!newEmail.trim()) {
      return {
        success: false,
        error: {
          message: "Email tidak boleh kosong",
          code: "VALIDATION_ERROR",
          statusCode: 400,
        },
      };
    }

    await auth.api.changeEmail({
      headers: await headers(),
      body: {
        newEmail: newEmail.trim(),
      },
    });

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      error: parseError(error),
    };
  }
}
