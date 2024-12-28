"use client"

import { cn } from "@/lib/utils"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import React from "react"
import { Input } from "./input"

interface SearchFieldProps extends React.ComponentProps<typeof Input> {
  className?: string
}

export const SearchField: React.FC<SearchFieldProps> = ({
  className,
  ...props
}) => {
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const q = (form.q as HTMLInputElement).value.trim()
    if (!q) return
    router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("relative w-full flex-1 md:max-w-md", className)}
    >
      <Input
        name="q"
        placeholder="Search . . ."
        className="bg-secondary pe-10 text-muted-foreground"
        {...props}
      />
      <Search className="absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 transform cursor-pointer text-primary" />
    </form>
  )
}
