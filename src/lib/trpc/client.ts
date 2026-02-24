import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { AppRouter } from "~/lib/trpc/root";

/**
 * tRPC React hooks — use `useTRPC()` in client components.
 *
 * Usage:
 * ```tsx
 * const trpc = useTRPC();
 * const { data } = useSuspenseQuery(trpc.admin.getStats.queryOptions());
 * ```
 */
export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
