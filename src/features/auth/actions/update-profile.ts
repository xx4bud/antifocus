"use server";

import { headers } from "next/headers";
import { auth } from "~/lib/auth";
import { parseError } from "~/utils/error";
import type { AppResponse } from "~/utils/types";

export async function updateProfile(
  field: "name" | "username" | "image" | "phoneNumber",
  value: string
): Promise<AppResponse<unknown>> {
  try {
    const data: Record<string, string> = {};

    if (field === "name") {
      if (!value.trim()) {
        return {
          success: false,
          error: {
            message: "Nama tidak boleh kosong",
            code: "VALIDATION_ERROR",
            statusCode: 400,
          },
        };
      }
      data.name = value.trim();
    } else if (field === "username") {
      if (!value.trim()) {
        return {
          success: false,
          error: {
            message: "Username tidak boleh kosong",
            code: "VALIDATION_ERROR",
            statusCode: 400,
          },
        };
      }
      data.username = value.trim();
    } else if (field === "image") {
      data.image = value;
    } else if (field === "phoneNumber") {
      data.phoneNumber = value.trim();
    }

    await auth.api.updateUser({
      headers: await headers(),
      body: data,
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
