import "server-only";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  createTRPCOptionsProxy,
  type TRPCQueryOptions,
} from "@trpc/tanstack-react-query";
import { cache } from "react";
import { createContext } from "~/lib/trpc/context";
import { makeQueryClient } from "~/lib/trpc/query-client";
import { type AppRouter, appRouter, createCaller } from "~/lib/trpc/root";

/**
 * Cached QueryClient per request — ensures a single QueryClient instance
 * throughout a single server render pass (React `cache()` is per-request).
 */
const getQueryClient = cache(makeQueryClient);

/**
 * Server-side tRPC options proxy for use with prefetching.
 *
 * Usage:
 * ```tsx
 * // In a server component
 * import { trpc, HydrateClient, prefetch } from "~/lib/trpc/server";
 *
 * export default async function Page() {
 *   prefetch(trpc.admin.getStats.queryOptions());
 *   return (
 *     <HydrateClient>
 *       <ClientComponent />
 *     </HydrateClient>
 *   );
 * }
 * ```
 */
export const trpc = createTRPCOptionsProxy<AppRouter>({
  router: appRouter,
  ctx: createContext,
  queryClient: getQueryClient,
});

/**
 * Server-side tRPC caller for direct data fetching in React Server Components.
 *
 * Usage:
 * ```ts
 * import { api } from "~/lib/trpc/server";
 *
 * const stats = await api.admin.getStats();
 * ```
 */
export const api = createCaller(createContext);

/**
 * Hydration boundary — dehydrates prefetched queries from the server
 * so they are available to client components without refetching.
 */
export function HydrateClient(props: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}

/**
 * Prefetch a tRPC query on the server.
 * Automatically detects infinite queries vs regular queries.
 *
 * Must be called inside a server component, and the results
 * are hydrated via `<HydrateClient>`.
 */
export function prefetch<T extends ReturnType<TRPCQueryOptions<never>>>(
  queryOptions: T
): void {
  const queryClient = getQueryClient();

  if (isInfiniteQueryOptions(queryOptions)) {
    queryClient.prefetchInfiniteQuery(
      queryOptions as Parameters<typeof queryClient.prefetchInfiniteQuery>[0]
    );
  } else {
    queryClient.prefetchQuery(
      queryOptions as Parameters<typeof queryClient.prefetchQuery>[0]
    );
  }
}

/**
 * Type guard — checks if query options represent an infinite query
 * by inspecting the query key metadata.
 */
function isInfiniteQueryOptions(opts: unknown): boolean {
  const queryKey = (opts as { queryKey?: readonly unknown[] }).queryKey;
  return (
    Array.isArray(queryKey) &&
    queryKey.length > 1 &&
    typeof queryKey[1] === "object" &&
    queryKey[1] !== null &&
    "type" in queryKey[1] &&
    (queryKey[1] as Record<string, unknown>).type === "infinite"
  );
}
