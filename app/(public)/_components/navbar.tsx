import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import React from 'react';
import SearchField from '@/components/search-field';
import { UserIcon } from 'lucide-react';

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-10 w-full border-b bg-primary">
      <div className="mx-auto flex h-[55px] max-w-6xl items-center justify-between gap-2 px-2 md:h-[60px] md:gap-10">
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

        <div className="max-w-md flex-1">
          <SearchField />
        </div>

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
            <Button variant="secondary" className="font-bold">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
