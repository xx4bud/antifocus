import React from 'react'
import { SessionProvider } from 'next-auth/react';
import NavBar from '@/app/(main)/_components/navbar';
import BottomTab from '@/app/(main)/_components/bottomtab';
import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import prisma from '@/lib/prisma';


export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    sellerId: string;
  };
}) {
  const session = await auth();
  const userId = session?.user.id;

  if (!session) redirect('/sign-in');

  const sellerId = params.sellerId;

  const seller = await prisma.seller.findUnique({
    where: {
      id: sellerId,
      userId,
    },
  });

  if (!seller) return notFound();

  if (seller.userId !== userId) return notFound();

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
  )
}
