import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { adminRouter } from "~/features/admin/router";
import { createCallerFactory, router } from "./init";

/**
 * Root router — merges all feature routers.
 *
 * Add new feature routers here as the app grows:
 * ```ts
 * export const appRouter = router({
 *   admin: adminRouter,
 *   product: productRouter,
 *   order: orderRouter,
 *   cart: cartRouter,
 * });
 * ```
 */
export const appRouter = router({
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;

/**
 * Server-side caller factory.
 * Use `createCaller` in server components to call tRPC procedures directly.
 */
export const createCaller = createCallerFactory(appRouter);

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
