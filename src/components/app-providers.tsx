import * as React from "react";
import { QueryProvider } from "@/components/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import { getSession } from "@/lib/utils";

interface AppProvidersProps {
  children: React.ReactNode;
}

export async function AppProviders({
  children,
}: AppProvidersProps) {
  const session = await getSession();

  return (
    <SessionProvider session={session}>
      <QueryProvider>
        <TooltipProvider delayDuration={0}>
          <div className="flex min-h-svh flex-1 flex-col bg-background">
            {children}
          </div>
        </TooltipProvider>
        <Toaster />
      </QueryProvider>
    </SessionProvider>
  );
}
