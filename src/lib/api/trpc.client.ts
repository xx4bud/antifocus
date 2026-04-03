import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { AppRouter } from "./root";

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
