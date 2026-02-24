import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
import { isServer } from "~/utils/env";
import { SuperJSON } from "~/utils/serializers";

/**
 * Creates a shared QueryClient with production-ready defaults.
 *
 * - staleTime: 30 seconds to avoid unnecessary refetches
 * - refetchOnWindowFocus: disabled for less aggressive refetching
 * - Dehydration: includes pending queries for SSR streaming
 * - SuperJSON serialization for proper Date/Map/Set transfer
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000, // 30 seconds
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * Returns a singleton QueryClient on the browser,
 * or a fresh one on the server (to avoid cross-request leaks).
 */
export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
}
