import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { signOut } from '@/auth';
import { LogOut, ShoppingCartIcon, SparklesIcon } from 'lucide-react';
import { User } from 'next-auth';
import prisma from '@/lib/prisma';

interface UserButtonProps {
  user: User;
}

export default async function UserButton({ user }: UserButtonProps) {
  const seller = await prisma.seller.findFirst({
    where: {
      userId: user.id,
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className="flex-none rounded-full">
          <Image
            src={user?.image ?? '/avatar-placeholder.png'}
            alt={`@${user?.username}`}
            width={50}
            height={50}
            className="aspect-square rounded-full bg-background object-cover"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="m-1">
        <DropdownMenuLabel className="text-center">
          <Link href={`/${user?.username}`}>
            <span>@{user?.username || 'User'}</span>
          </Link>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {(seller || user?.role === 'ADMIN') && (
            <DropdownMenuItem asChild>
              <Link href={`/${user?.username}/${seller?.id}`}>
                <SparklesIcon className="mr-2 h-4 w-4" />
                My Shop
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link href="/cart">
              <ShoppingCartIcon className="mr-2 h-4 w-4" />
              <span>My Cart</span>
            </Link>
          </DropdownMenuItem>
          {/* {user?.role === 'ADMIN' && (
            <DropdownMenuItem asChild>
              <Link href="/dashboard">
                <Lock className="mr-2 h-4 w-4" />
                Admin
              </Link>
            </DropdownMenuItem>
          )}
          {user?.role === 'USER' && (
            <DropdownMenuItem asChild>
              <Link href="/register">
                <SparklesIcon className="mr-2 h-4 w-4" />
                Create Store
              </Link>
            </DropdownMenuItem>
          )}
          {(seller || user?.role === 'ADMIN') && (
            <DropdownMenuItem asChild>
              <Link href={`/${seller?.id}`}>
                <SparklesIcon className="mr-2 h-4 w-4" />
                My Store
              </Link>
            </DropdownMenuItem>
          )} */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <form
            action={async () => {
              'use server';
              await signOut();
            }}>
            <button type="submit" className="flex w-full items-center gap-4">
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
