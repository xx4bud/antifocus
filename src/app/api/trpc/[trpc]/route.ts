import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createContext } from "@/lib/api/context";
import { appRouter } from "@/lib/api/root";

/**
 * Handle Next.js App Router HTTP requests for tRPC.
 */
const handler = async (req: Request) => {
  return await fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(),
    onError: ({ path, error }) => {
      console.error(
        `tRPC error on path ${path ?? "<no-path>"}: ${error.message}`
      );
    },
  });
};

export { handler as GET, handler as POST };
