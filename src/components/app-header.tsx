"use client"

import {
  ChevronLeftIcon,
  SearchIcon,
  XIcon,
} from "lucide-react"
import Image from "next/image"
import React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { SearchField } from "@/components/ui/search-field"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FaRegUser, FaWhatsapp } from "react-icons/fa6"
import { User } from "next-auth"
import { UserButton } from "./user-button"

interface AppHeaderProps {
  user?: User
  back?: boolean
  icon?: boolean
}

export function AppHeader({
  user,
  back,
  icon = true,
}: AppHeaderProps) {
  const [searchFieldOpen, setSearchFieldOpen] =
    React.useState(false)

  const router = useRouter()

  const handleSearch = () => {
    setSearchFieldOpen(!searchFieldOpen)
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <header className="flex h-16 shrink-0 items-center border-b bg-primary text-secondary">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4">
        {searchFieldOpen ? (
          <>
            <ChevronLeftIcon
              className="-m-3 size-9 cursor-pointer"
              onClick={handleSearch}
            />
            <SearchField className="w-full flex-1" />
          </>
        ) : (
          <>
            {back ? (
              <>
                <ChevronLeftIcon
                  className="-m-3 size-9 cursor-pointer"
                  onClick={handleBack}
                />
                <span className="sr-only">Back</span>
                <Link href="/">
                  <Image
                    src={"/logo-white.png"}
                    alt="Antifocus Logo"
                    priority
                    width={151}
                    height={36}
                    className="h-9 w-auto flex-shrink-0"
                  />
                  <span className="sr-only">Antifocus</span>
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center">
                  <Link href="/">
                    <Image
                      src={"/logo-white.png"}
                      alt="Antifocus Logo"
                      priority
                      width={151}
                      height={36}
                      className="h-9 w-auto flex-shrink-0"
                    />
                    <span className="sr-only">
                      antifocus
                    </span>
                  </Link>
                </div>

                <div className="hidden flex-1 items-center justify-center md:flex">
                  <SearchField />
                </div>

                {/* Desktop */}
                <div className="hidden items-center gap-3 md:flex">
                  {user ? (
                    <UserButton user={user} />
                  ) : (
                    <>
                      <Link href="/signin">
                        <Button className="border hover:opacity-90">
                          <FaRegUser />
                          SignIn
                        </Button>
                      </Link>
                    </>
                  )}

                  <Link
                    href="https://wa.me/6289602808726"
                    target="_blank"
                  >
                    <Button variant="secondary">
                      <FaWhatsapp />
                      WhatsApp
                    </Button>
                  </Link>
                </div>
              </>
            )}
            {/* Mobile */}
            <div className="flex items-center gap-4 md:hidden">
              {icon && (
                <>
                  <SearchIcon
                    className="-m-1 size-7 cursor-pointer"
                    onClick={handleSearch}
                  />
                  <SidebarTrigger />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  )
}
