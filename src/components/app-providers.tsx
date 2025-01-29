import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
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
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
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
  );
}
