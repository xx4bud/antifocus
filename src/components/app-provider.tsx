import {
  SidebarInset,
  SidebarProvider,
} from "./ui/sidebar";
import { TooltipProvider } from "./ui/tooltip";
import { Toaster } from "./ui/sonner";
import { SessionProvider } from "next-auth/react";
import { getCurrentUser, getSession } from "@/actions/user";
import { AppSidebar } from "./app-sidebar";

export async function AppProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const user = await getCurrentUser();

  return (
    <SessionProvider session={session}>
      <TooltipProvider delayDuration={0}>
        <SidebarProvider defaultOpen={false}>
          <AppSidebar user={user} />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
      <Toaster />
    </SessionProvider>
  );
}
