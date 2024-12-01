'use client';

import Image from 'next/image';
import React, { useTransition } from 'react';
import { signIn } from 'next-auth/react';
import LoadingButton from '@/components/loading-button';

export default function GoogleButton({ label }: { label?: string }) {
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      await signIn('google', {
        redirect: false,
        redirectTo: process.env.NEXT_PUBLIC_URL,
      });
    });
  };

  return (
    <LoadingButton
      variant="outline"
      className="w-full gap-2 font-semibold"
      loading={isPending}
      onClick={onClick}>
      <Image src="/google.svg" alt="Google" width={20} height={20} />
      {label}
    </LoadingButton>
  );
}
