import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { authRouter } from "@/features/auth/lib/routers";
import { catalogRouter } from "@/features/catalog/lib/routers";
import { coreRouter } from "@/features/core/lib/routers";
import { financeRouter } from "@/features/finance/lib/routers";
import { marketingRouter } from "@/features/marketing/lib/routers";
import { orderRouter } from "@/features/order/lib/routers";
import { orgRouter } from "@/features/org/lib/routers";
import { productionRouter } from "@/features/production/lib/routers";
import { supplyRouter } from "@/features/supply/lib/routers";
import { taxonomyRouter } from "@/features/taxonomy/lib/routers";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  org: orgRouter,
  core: coreRouter,
  taxonomy: taxonomyRouter,
  catalog: catalogRouter,
  order: orderRouter,
  finance: financeRouter,
  production: productionRouter,
  supply: supplyRouter,
  marketing: marketingRouter,
});

export type AppRouter = typeof appRouter;

/**
 * Inference helpers for input types
 * @example
 * type PostByIdInput = RouterInputs['post']['byId']
 *      ^? { id: number }
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example
 * type AllPostsOutput = RouterOutputs['post']['all']
 *      ^? Post[]
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;
