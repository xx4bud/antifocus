import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function AppNavBar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-primary">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              src="/logo-white.png"
              alt="Antifocus"
              width={144}
              height={32}
              className="h-8 w-36 hover:opacity-90"
            />
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <SidebarTrigger className="text-secondary" />
        </div>
      </div>
    </nav>
  );
}
