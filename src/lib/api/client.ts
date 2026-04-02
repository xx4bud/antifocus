import "client-only";

import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@/lib/api/root";

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
