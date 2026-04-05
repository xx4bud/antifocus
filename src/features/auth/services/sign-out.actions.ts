"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { parseError } from "@/lib/utils/error";
import type { AppResponse } from "@/lib/utils/types";

export async function signOutAction(): Promise<AppResponse<void>> {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: parseError(error) };
  }
}
