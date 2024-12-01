'use client';

import { SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';

interface SearchFieldProps {
  className?: string;
}

export default function SearchField({ className }: SearchFieldProps) {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.q as HTMLInputElement).value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={handleSubmit} method="GET" action="/search">
      <div className={cn('relative mx-auto w-full max-w-md', className)}>
        <Input
          name="q"
          placeholder="Search . . ."
          className="bg-secondary pe-10"
        />
        <SearchIcon className="absolute right-2 top-1/2 size-6 -translate-y-1/2 transform text-primary" />
      </div>
    </form>
  );
}
