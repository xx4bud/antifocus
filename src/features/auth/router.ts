import { z } from "zod";
import { updateUserMetadata } from "@/features/auth/mutations/user";
import { adminProcedure, authProcedure, router } from "@/lib/api/trpc.server";

export const authRouter = router({
  /**
   * Get current authenticated user session data
   */
  me: authProcedure.query(async ({ ctx }) => {
    // We already have user in ctx, but we could re-fetch if needed for fresh data
    // Here we just return the context user for efficiency
    return ctx.user;
  }),

  /**
   * Update current user profile/metadata
   */
  updateProfile: authProcedure
    .input(
      z.object({
        name: z.string().min(2).optional(),
        displayUsername: z.string().min(3).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await updateUserMetadata(ctx.user.id, input);
      return updatedUser;
    }),

  /**
   * Test RBAC: Only accessible by admin/super_admin
   */
  adminPing: adminProcedure.query(() => {
    return "Pong! You are an admin.";
  }),
});
