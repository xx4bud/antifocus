import React, { cache } from 'react';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { notFound, redirect } from 'next/navigation';

interface DashboardPageProps {
  params: {
    sellerId: string;
  };
}

const getSeller = cache(async (sellerId: string) => {
  return prisma.seller.findUnique({
    where: {
      id: sellerId,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });
});

export async function generateStaticParams() {
  const allSellers = await prisma.seller.findMany();

  return allSellers.map(({ id }) => ({ sellerId: id }));
}

export async function generateMetadata({ params }: DashboardPageProps) {
  const { sellerId } = await params;

  const seller = await getSeller(sellerId);

  return {
    title: seller?.name || 'Dashboard',
  };
}

export default async function DashboardPage({
  params,
}: DashboardPageProps) {
  const { sellerId } = await params;

    await new Promise((resolve) => setTimeout(resolve, 1500));

  const session = await auth();

  if (!session) return redirect('/sign-in');


  const seller = await prisma.seller.findUnique({
    where: {
      id: sellerId,
      userId: session.user.id,
    },
  });

  if (!seller) return notFound();

  return <div>Dashboard: {seller.name}</div>;
}