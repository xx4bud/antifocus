// Unified entry for tRPC API layer

export { getQueryClient } from "./query";
export { TRPCProvider, useTRPC } from "./trpc.client";
export * from "./types";

// Server-side exports - import from @/lib/api/server in server components
// export { api, HydrateClient, prefetch, trpc } from "./server";
