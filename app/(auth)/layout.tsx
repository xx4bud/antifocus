import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import NavBar from './_components/navbar';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session) {
    redirect('/');
  }

  return (
    <SessionProvider session={session}>
      <div className="flex min-h-screen w-full flex-col gap-2">
        <NavBar />
        <div className="mx-auto flex h-full w-full max-w-6xl px-2">{children}</div>
      </div>
    </SessionProvider>
  );
}
