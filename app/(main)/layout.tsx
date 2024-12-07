import React from 'react';
import { AppNavBar } from '@/components/app-navbar';
import { SessionProvider } from 'next-auth/react';
import { getSession } from '@/lib/utils';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <SessionProvider session={session}>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex min-h-screen w-full flex-col gap-2">
          <AppNavBar />
          <main className="mx-auto h-full w-full max-w-5xl flex-grow px-2">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
}
