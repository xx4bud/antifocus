import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { cache } from 'react';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getUserDataSelect } from '@/types';

interface UserPageProps {
  params: {
    username: string;
  };
}

const getUser = cache(async (username: string, session?: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: 'insensitive',
      },
    },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
});

export async function generateStaticParams() {
  const allUsers = await prisma.user.findMany();

  return allUsers.map(({ username }) => ({ username }));
}

export async function generateMetadata({
  params: { username },
}: UserPageProps): Promise<Metadata> {
  const session = await auth();

  if (!session) return {};

  const user = await getUser(username, session.user.id);

  if (!user) return notFound();

  return {
    title: user.name || `@${user.username}`,
  };
}

export default async function UserPage({
  params: { username },
}: UserPageProps) {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const session = await auth();

  const user = await getUser(username, session?.user?.id);

  if (!user) return notFound();

  if (!session) return redirect('/sign-in');

  // if (!user || !session || session.user.username !== username) {
  //   return <div>Anda harus login untuk melihat halaman ini.</div>;
  // }

  return <div>{user.name}</div>;
}
