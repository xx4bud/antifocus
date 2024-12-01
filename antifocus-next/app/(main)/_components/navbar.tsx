import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React from 'react';
import SearchField from '@/components/search-field';
import { MenuIcon, UserIcon } from 'lucide-react';
import UserButton from '@/components/user-button';
import { auth } from '@/auth';

export default async function NavBar() {
  const session = await auth();
  const user = session?.user;

  return (
    <nav className="sticky top-0 z-10 w-full border-b bg-primary">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-2 py-2 md:gap-10">
        <div className="hidden items-center gap-2 sm:flex">
          <Link href="/">
            <Image
              src="/antifocus-white.png"
              alt="antifocus"
              width={144}
              height={32}
              className="h-8 w-36 hover:opacity-90"
            />
          </Link>
        </div>

        <div className="flex-1">
          <SearchField />
        </div>

        {user ? (
          <div className="flex items-center">
            <div className="mt-1 hidden sm:block">
              <UserButton user={user} />
            </div>
            <div className="block sm:hidden">
              <MenuIcon className="-mx-1 size-10 text-secondary" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <Link
                href="/sign-up"
                className="flex items-center gap-1 text-sm font-semibold text-white hover:opacity-90">
                <UserIcon className="size-7" />
                <span>Sign Up</span>
              </Link>
            </div>
            <Link href="/sign-in">
              <Button variant="secondary" size="lg" className="font-bold px-4">
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
