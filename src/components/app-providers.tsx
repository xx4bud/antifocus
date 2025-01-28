import { Toaster } from "@/components/ui/toaster";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TooltipProvider } from "./ui/tooltip";
import { SessionProvider } from "next-auth/react";
import { getSession } from "@/lib/queries";

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
        <AppSidebar user={session?.user} />
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
