import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { adminRouter } from "@/features/admin/router";
import { authRouter } from "@/features/auth/router";
import { publicProcedure, router } from "./trpc";

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

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
