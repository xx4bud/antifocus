"use server";

import { createId } from "@paralleldrive/cuid2";
import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Session, User } from "@/lib/db/schema";
import { auditLogs } from "@/lib/db/schema/core";
import { createError, parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";
import { revokeAllUserSessions, softDeleteUser } from "./mutations";
import { getUserById } from "./queries";
import type { BanUserData, UpdateProfileData } from "./validators";

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

      const freshUser = await getUserById(result.user.id);
      if (!freshUser.ok) {
        throw freshUser.error;
      }

      return freshUser.value;
    }, parseError)
);

export const updateUserProfile = async (
  userId: string, // the user being updated
  data: UpdateProfileData
): Promise<AppResult<User>> => {
  return tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }

    // 1. Prioritize Better Auth API for updates (handles name, image, etc natively)
    const result = await auth.api.updateUser({
      body: {
        name: data.name,
      },
      headers: await headers(),
    });

    if (!result?.status) {
      throw createError("BAD_REQUEST", "Failed to update profile", 400);
    }

    // 2. Audit log via Drizzle
    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: "system",
      actorName: sessionRes.value.user.name,
      actorId: sessionRes.value.user.id,
      action: "user.profile_updated",
      targetName: "users",
      targetId: userId,
    });

    const updatedUserRes = await getUserById(userId);
    if (!updatedUserRes.ok) {
      throw updatedUserRes.error;
    }

    return updatedUserRes.value as User;
  }, parseError);
};

export const banUser = async (
  targetUserId: string,
  data: BanUserData
): Promise<AppResult<boolean>> => {
  return tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const adminUser = sessionRes.value.user;

    if (adminUser.role !== "admin" && adminUser.role !== "superadmin") {
      throw createError("FORBIDDEN", "Only admins can ban users.", 403);
    }

    // 1. Prioritize Better Auth API Admin Plugin
    // This natively marks the user as banned and revokes sessions in Better Auth
    const banResult = await auth.api.banUser({
      body: {
        userId: targetUserId,
        banReason: data.banReason,
      },
      headers: await headers(),
    });

    if (!banResult) {
      throw createError("BAD_REQUEST", "Failed to ban user", 400);
    }

    // 2. Audit log via Drizzle
    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: "system",
      actorName: adminUser.name,
      actorId: adminUser.id,
      action: "user.banned",
      targetName: "users",
      targetId: targetUserId,
      metadata: { reason: data.banReason },
    });

    return true;
  }, parseError);
};

export const deleteUserAccount = async (
  targetUserId: string
): Promise<AppResult<User>> => {
  return tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    // Better Auth `deleteUser` uses HARD DELETE.
    // AGENTS.md Rule 9 strictly enforces SOFT DELETES.
    // Therefore, we MUST use manual mutation here.

    // 1. Manual Soft Delete
    const result = await softDeleteUser(targetUserId);
    if (!result.ok) {
      throw result.error;
    }

    // 2. Manual session revocation
    await revokeAllUserSessions(targetUserId);

    // 3. Audit log
    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: "system",
      actorName: actor.name,
      actorId: actor.id,
      action: "user.deleted",
      targetName: "users",
      targetId: targetUserId,
    });

    return result.value;
  }, parseError);
};
