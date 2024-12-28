"use client"

import Image from "next/image"
import React, { useTransition } from "react"
import { LoadingButton } from "@/components/ui/loading-button"
import { signIn } from "next-auth/react"

export function GoogleButton({
  label,
}: {
  label?: string
}) {
  const [isPending, startTransition] = useTransition()

  const onClick = () => {
    startTransition(async () => {
      await signIn('google')
    })
  }

  return (
    <LoadingButton
      variant="outline"
      className="w-full gap-2 font-semibold"
      loading={isPending}
      onClick={onClick}
    >
      <Image
        src="/google.svg"
        alt="Google"
        width={20}
        height={20}
      />
      {label}
    </LoadingButton>
  )
}
