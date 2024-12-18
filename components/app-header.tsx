"use client";

import { User } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { UserButton } from "./user-button";
import { FaRegUser, FaWhatsapp } from "react-icons/fa6";
import { SidebarTrigger } from "./ui/sidebar";
import SearchField from "./ui/search-field";
import { Input } from "./ui/input";
import { ChevronLeftIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { set } from "react-hook-form";
import { useRouter } from "next/navigation";

interface AppHeaderProps {
  user: User | null;
  search?: boolean;
  back?: boolean;
}
export function AppHeader({ user, search = true, back }: AppHeaderProps) {
  const [mobileSearch, setMobileSearch] = useState(false);

  const handleSearch = () => {
    setMobileSearch(!mobileSearch);
  };

  const router = useRouter();

  return (
    <header className="h-16 w-full bg-primary text-secondary">
      <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between p-4">
        {mobileSearch ? (
          <div className="flex flex-1 items-center gap-4 md:hidden">
            <ChevronLeftIcon
              onClick={handleSearch}
              className="-m-3 size-9 cursor-pointer"
            />
            <SearchField className="flex-1" />
          </div>
        ) : (
          <>
            {back ? (
              <div className="flex flex-1 items-center justify-between">
                <ChevronLeftIcon
                  onClick={() => router.back()}
                  className="-m-3 size-9 cursor-pointer"
                />
                <Link href="/">
                  <Image
                    src="/logo-white.png"
                    alt="Antifocus"
                    width={151}
                    height={36}
                    priority
                    className="h-9 w-auto"
                  />
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-center">
                  <Link href="/">
                    <Image
                      src="/logo-white.png"
                      alt="Antifocus"
                      width={151}
                      height={36}
                      priority
                      className="h-9 w-auto"
                    />
                  </Link>
                </div>

                <div className="hidden flex-1 items-center justify-center md:flex">
                  <SearchField />
                </div>

                {/* Desktop */}
                <div className="hidden items-center gap-3 md:flex">
                  {!user ? (
                    <Button className="border hover:opacity-90" asChild>
                      <Link
                        href="/api/auth/signin"
                        //   href="/signin"
                      >
                        <FaRegUser />
                        SignIn
                      </Link>
                    </Button>
                  ) : (
                    <UserButton user={user} />
                  )}
                  <Button variant="secondary" asChild>
                    <Link href="https://wa.me/6289602808726" target="_blank">
                      <FaWhatsapp />
                      WhatsApp
                    </Link>
                  </Button>
                </div>

                {/* Mobile */}
                <div className="flex items-center gap-3 md:hidden">
                  {search && (
                    <SearchIcon
                      className="size-7 cursor-pointer"
                      onClick={handleSearch}
                    />
                  )}
                  <SidebarTrigger />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </header>
  );
}
