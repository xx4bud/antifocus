import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "@/lib/auth";
import type { Session, User } from "@/lib/db/schema";
import { createError, parseError } from "@/lib/utils/error";
import type { AppResult } from "@/lib/utils/result";
import { tryCatchAsync } from "@/lib/utils/result";

export const getAuthSession = cache(
  async (): Promise<AppResult<Session | null>> =>
    tryCatchAsync(
      async () =>
        (await auth.api.getSession({
          headers: await headers(),
        })) as Session | null,
      parseError
    )
);

export const requireAuthSession = cache(
  async (): Promise<AppResult<Session>> =>
    tryCatchAsync(async () => {
      const result = await auth.api.getSession({
        headers: await headers(),
      });

      if (!result) {
        throw createError(
          "UNAUTHORIZED",
          "Unauthorized. Please login again.",
          401
        );
      }

      return result as Session;
    }, parseError)
);

export const getAuthUser = cache(
  async (): Promise<AppResult<User | null>> =>
    tryCatchAsync(async () => {
      const result = await auth.api.getSession({
        headers: await headers(),
      });

      if (!result) {
        return null;
      }

      return result.user as User;
    }, parseError)
);
