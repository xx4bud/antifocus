'use client';

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export const BackButton = ({ className }: { className?: string }) => {
  const router = useRouter();
  const iconSource = className?.includes('text-secondary')
    ? '/icon-white.png'
    : '/icon-black.png';

  return (
    <button className="sm:hidden" onClick={() => router.back()}>
      <Image
        src={iconSource}
        alt="antifocus icon"
        width={20}
        height={20}
        className={cn(
          'size-8 hover:cursor-pointer hover:opacity-90',
          className
        )}
      />
      <span className="sr-only">Back</span>
    </button>
  );
};
