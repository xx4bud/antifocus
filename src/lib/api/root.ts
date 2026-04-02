import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
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
});

export type AppRouter = typeof appRouter;

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
