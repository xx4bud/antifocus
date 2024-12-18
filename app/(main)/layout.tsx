import { AppHeader } from "@/components/app-header";
import React from "react";
import { getSession } from "@/lib/session";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const user = session?.user;

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar user={user || null} />
      <SidebarInset>
        <div className="flex min-h-screen w-full flex-col">
          <AppHeader user={user || null} />
          <div className="mx-auto flex h-full w-full max-w-6xl p-3">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
