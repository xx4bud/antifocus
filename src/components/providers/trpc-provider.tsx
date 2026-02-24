"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createTRPCClient,
  httpBatchStreamLink,
  loggerLink,
} from "@trpc/client";
import { useState } from "react";
import { TRPCProvider } from "~/lib/trpc/client";
import { getQueryClient } from "~/lib/trpc/query-client";
import type { AppRouter } from "~/lib/trpc/root";
import { isDevelopment } from "~/utils/env";
import { SuperJSON } from "~/utils/serializers";
import { getBaseURL } from "~/utils/urls";

/**
 * Provides tRPC + TanStack Query context to the app.
 * Follows the tRPC v11 recommended pattern with `@trpc/tanstack-react-query`.
 *
 * @see https://trpc.io/docs/client/tanstack-react-query/setup
 */
export function TRPCReactProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        loggerLink({
          enabled: (op) =>
            isDevelopment ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        httpBatchStreamLink({
          transformer: SuperJSON,
          url: `${getBaseURL()}/api/trpc`,
          headers() {
            const headers = new Headers();
            headers.set("x-trpc-source", "nextjs-react");
            return headers;
          },
        }),
      ],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider queryClient={queryClient} trpcClient={trpcClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </TRPCProvider>
    </QueryClientProvider>
  );
}
