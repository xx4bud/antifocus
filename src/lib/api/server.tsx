import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  createTRPCOptionsProxy,
  type TRPCQueryOptions,
} from "@trpc/tanstack-react-query";
import { cache } from "react";
import { createContext } from "./context";
import { makeQueryClient } from "./query";
import { type AppRouter, appRouter } from "./root";
import { createCallerFactory } from "./trpc";

const getQueryClient = cache(makeQueryClient);

export const createCaller = createCallerFactory(appRouter);

export const trpc = createTRPCOptionsProxy<AppRouter>({
  router: appRouter,
  ctx: createContext,
  queryClient: getQueryClient,
});

export const api = createCaller(createContext);

export function HydrateClient(props: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}

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
