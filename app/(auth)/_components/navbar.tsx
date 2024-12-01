import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { BackButton } from '@/components/back-button';

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-10 w-full border-b bg-primary">
      <div className="mx-auto flex h-[50px] max-w-6xl items-center justify-between gap-2 px-2 md:h-[60px] md:gap-10">
        <BackButton className="text-secondary" />
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
      </div>
    </nav>
  );
}
