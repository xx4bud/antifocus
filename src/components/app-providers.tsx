import { getSession } from "@/lib/queries";
import { AppSidebar } from "./app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { ReactQueryProvider } from "@/components/react-query-provider";
import { SessionProvider } from "next-auth/react";

export async function AppProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const user = session?.user;

  return (
    <ReactQueryProvider>
      <SessionProvider session={session}>
        <SidebarProvider defaultOpen={false}>
          <AppSidebar user={user} />
          {children}
        </SidebarProvider>
        <Toaster />
      </SessionProvider>
    </ReactQueryProvider>
  );
}
