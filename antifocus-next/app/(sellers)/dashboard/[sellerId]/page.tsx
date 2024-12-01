import React from 'react';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

interface DashboardPageProps {
  params: {
    sellerId: string;
  };
}

export default async function DashboardPage({
  params,
}: DashboardPageProps) {

  const session = await auth();
  const userId = session?.user.id;

  const seller = await prisma.seller.findUnique({
    where: {
      id: params.sellerId,
      userId,
    },
  });

  if (!seller) return redirect('/');

  return <div>Dashboard: {seller.name}</div>;
}