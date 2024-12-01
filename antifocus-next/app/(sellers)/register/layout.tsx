import React from 'react'
import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';
import NavBar from '../_components/navbar';
import { notFound, redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
// import BottomTab from '../_components/bottomtab';

export default async function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) redirect('/sign-in');

  const seller = await prisma.seller.findFirst({
    where: {
      userId: session?.user?.id,
    },
  });

  const sellerId = seller?.id;

  if (sellerId) redirect(`/dashboard/${sellerId}`);


  return (
    <SessionProvider session={session}>
    <div className="flex min-h-screen w-full flex-col gap-2 sm:gap-4">
      <NavBar />
      <div className="mx-auto flex h-full w-full max-w-5xl px-2">
        {children}
      </div>
      {/* <BottomTab /> */}
    </div>
  </SessionProvider>
  )
}
