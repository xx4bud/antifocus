import { z } from "zod/v4";
import {
  createTRPCRouter,
  orgProcedure,
  protectedProcedure,
} from "@/lib/api/trpc";
import { createError } from "@/lib/utils/error";
import { listUsers } from "./queries";
import {
  banUser,
  deleteUserAccount,
  getAuthUser,
  updateUserProfile,
} from "./services";
import {
  banUserSchema,
  updateProfileSchema,
  userFiltersSchema,
} from "./validators";

export const authRouter = createTRPCRouter({
  // ==============================
  // Current User Profile
  // ==============================

  me: protectedProcedure.query(async () => {
    const userRes = await getAuthUser();
    if (!userRes.ok) {
      throw userRes.error;
    }
    if (!userRes.value) {
      throw createError("UNAUTHORIZED", "Not logged in", 401);
    }

    return userRes.value;
  }),

  updateProfile: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      // ctx.user is guaranteed by protectedProcedure
      const userId = ctx.user?.id || ctx.session?.userId;

      if (!userId) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }

      const result = await updateUserProfile(userId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  // ==============================
  // Admin & ERP Operations
  // ==============================

  listUsers: orgProcedure.input(userFiltersSchema).query(async ({ input }) => {
    // orgProcedure implies caller has ERP privileges
    const result = await listUsers(input);
    if (!result.ok) {
      throw result.error;
    }
    return result.value;
  }),

  banUser: orgProcedure
    .input(
      z.object({
        userId: z.string(),
        data: banUserSchema,
      })
    )
    .mutation(async ({ input }) => {
      // banUser service internally verifies if actor is admin
      const result = await banUser(input.userId, input.data);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  deleteUser: orgProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input }) => {
      // deleteUserAccount service internally handles soft delete & audit
      const result = await deleteUserAccount(input.userId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),
});
