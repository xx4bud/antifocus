import React from 'react';
import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';
import NavBar from './_components/navbar';
import BottomTab from './_components/bottomtab';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div className="flex min-h-screen w-full flex-col gap-2 sm:gap-4">
        <NavBar />
        <div className="mx-auto flex h-full w-full max-w-5xl px-2">
          {children}
        </div>
        <BottomTab />
      </div>
    </SessionProvider>
  );
}
