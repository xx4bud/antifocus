import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { cache } from 'react';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';

interface UserPageProps {
  params: {
    username: string;
  };
}

const getUser = cache(async (username: string, userId?: string) => {
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
  const user = session?.user;

  if (!user) return {};

  const userData = await getUser(username, user.id);

  if (!userData) return notFound();

  return {
    title: userData.name || `@${userData.username}`,
  };
}

export default async function UserPage({
  params: { username },
}: UserPageProps) {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const session = await auth();
  const user = session?.user;

  const userData = await getUser(username, user?.id);

  if (!userData) return notFound();

  if (!user) return redirect('/sign-in');

  // if (!user || !session || session.user.username !== username) {
  //   return <div>Anda harus login untuk melihat halaman ini.</div>;
  // }

  return <div>{userData.name}</div>;
}
