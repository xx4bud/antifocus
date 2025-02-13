import * as React from "react";
import { QueryProvider } from "@/components/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import { getSession } from "@/lib/utils";
import {
  SidebarInset,
  SidebarProvider,
} from "./ui/sidebar";
import { AppSidebar } from "./shared/app-sidebar";

interface AppProvidersProps {
  children: React.ReactNode;
}

export async function AppProviders({
  children,
}: AppProvidersProps) {
  const session = await getSession();
  const user = session?.user;

  return (
    <SessionProvider session={session}>
      <QueryProvider>
        <TooltipProvider delayDuration={0}>
          <SidebarProvider defaultOpen={false}>
            <AppSidebar user={user} />
            <SidebarInset>
              <div className="flex min-h-svh flex-1 flex-col bg-background">
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </TooltipProvider>
        <Toaster />
      </QueryProvider>
    </SessionProvider>
  );
}
