import { adminRouter } from "@/features/admin/router";
import { authRouter } from "@/features/auth/router";
import { publicProcedure, router } from "./trpc.server";

export const appRouter = router({
  health: publicProcedure.query(() => {
    return {
      status: "OK",
      timestamp: new Date().toISOString(),
      service: "Antifocus API",
    };
  }),

  auth: authRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
