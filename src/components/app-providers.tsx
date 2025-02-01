import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import { QueryProvider } from "@/components/query-provider";
import { auth } from "@/lib/auth";

interface AppProvidersProps {
  children: React.ReactNode;
}
export async function AppProviders({
  children,
}: AppProvidersProps) {
  const session = await auth()
  const user = session?.user;

  return (
    <QueryProvider>
      <SessionProvider session={session}>
        <SidebarProvider defaultOpen={false}>
          <AppSidebar user={user} />
          <SidebarInset>
            <TooltipProvider delayDuration={0}>
              <div className="relative flex min-h-svh flex-col bg-background">
                {children}
              </div>
            </TooltipProvider>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </SessionProvider>
    </QueryProvider>
  );
}
